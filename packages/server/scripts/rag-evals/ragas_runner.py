#!/usr/bin/env python3
import asyncio
import json
import math
import os
import sys
from typing import Any, Dict, List, Tuple

METRIC_NAMES = [
    "factual_correctness",
    "response_relevancy",
    "context_precision",
    "context_recall",
    "faithfulness",
]
DEFAULT_LLM_MODEL = "gpt-4o-mini"
DEFAULT_EMBEDDING_MODEL = "text-embedding-3-small"


def _safe_float(value: Any) -> float:
    try:
        number = float(value)
    except Exception:
        return float("nan")
    return number if math.isfinite(number) else float("nan")


def _mean(values: List[float]) -> float:
    finite_values = [value for value in values if math.isfinite(value)]
    if not finite_values:
        return float("nan")
    return sum(finite_values) / len(finite_values)


def _to_json_safe(value: Any) -> Any:
    if isinstance(value, float):
        return value if math.isfinite(value) else None
    if isinstance(value, dict):
        return {str(k): _to_json_safe(v) for k, v in value.items()}
    if isinstance(value, list):
        return [_to_json_safe(item) for item in value]
    if isinstance(value, tuple):
        return [_to_json_safe(item) for item in value]
    if hasattr(value, "item"):
        try:
            return _to_json_safe(value.item())
        except Exception:
            return str(value)
    return value


def _load_ragas() -> Tuple[List[Tuple[str, Any]], Dict[str, str]]:
    try:
        from langchain_openai import OpenAIEmbeddings  # type: ignore
        from openai import AsyncOpenAI  # type: ignore
        from ragas import __version__ as ragas_version  # type: ignore
        from ragas.llms import llm_factory  # type: ignore
        from ragas.metrics import (  # type: ignore
            ContextPrecision,
            ContextRecall,
            FactualCorrectness,
            Faithfulness,
            AnswerRelevancy,
        )
    except Exception as err:
        raise RuntimeError(
            "Missing Python deps for RAGAS. Install with: pip install ragas datasets openai"
        ) from err

    llm_model = os.getenv("RAGAS_EVAL_LLM_MODEL", DEFAULT_LLM_MODEL)
    embedding_model = os.getenv("RAGAS_EVAL_EMBEDDING_MODEL", DEFAULT_EMBEDDING_MODEL)

    client = AsyncOpenAI(
        api_key=os.getenv("OPENAI_API_KEY"),
        base_url=os.getenv("OPENAI_BASE_URL") or os.getenv("OPENAI_API_BASE"),
    )
    llm = llm_factory(llm_model, client=client)
    # Response relevancy expects embed_query/embed_documents methods.
    response_relevancy_embeddings = OpenAIEmbeddings(
        model=embedding_model,
        api_key=os.getenv("OPENAI_API_KEY"),
        base_url=os.getenv("OPENAI_BASE_URL") or os.getenv("OPENAI_API_BASE"),
    )

    metrics: List[Tuple[str, Any]] = [
        (
            "factual_correctness",
            FactualCorrectness(name="factual_correctness", llm=llm),
        ),
        (
            "response_relevancy",
            AnswerRelevancy(
                name="response_relevancy",
                llm=llm,
                embeddings=response_relevancy_embeddings,
            ),
        ),
        ("context_precision", ContextPrecision(llm=llm)),
        ("context_recall", ContextRecall(name="context_recall", llm=llm)),
        ("faithfulness", Faithfulness(name="faithfulness", llm=llm)),
    ]

    meta = {
        "ragasVersion": str(ragas_version),
        "llmModel": llm_model,
        "embeddingModel": embedding_model,
        "sampleClass": "SingleTurnSample",
        "datasetClass": "EvaluationDataset",
    }
    return metrics, meta


def _build_single_turn_sample(sample: Dict[str, Any]) -> Any:
    from ragas import SingleTurnSample  # type: ignore

    return SingleTurnSample(
        user_input=sample.get("question", "") or "",
        response=sample.get("answer", "") or "",
        retrieved_contexts=sample.get("contexts", []) or [],
        reference=sample.get("reference", "") or "",
    )


def _score_metric(metric: Any, sample: Any) -> float:
    return _safe_float(asyncio.run(metric.single_turn_ascore(sample)))


def _score_cases(
    eval_samples: List[Any], case_ids: List[str], metric_items: List[Tuple[str, Any]]
) -> Tuple[List[Dict[str, Any]], Dict[str, str]]:
    by_case: List[Dict[str, Any]] = []
    metric_errors: Dict[str, str] = {}

    for index, single_turn_sample in enumerate(eval_samples):
        row: Dict[str, Any] = {"case_id": case_ids[index]}
        for metric_name, metric in metric_items:
            try:
                score = _score_metric(metric, single_turn_sample)
                row[metric_name] = score if math.isfinite(score) else None
            except Exception as err:
                row[metric_name] = None
                if metric_name not in metric_errors:
                    metric_errors[metric_name] = str(err)
        by_case.append(row)

    return by_case, metric_errors


def _compute_aggregate(
    by_case: List[Dict[str, Any]], metric_names: List[str]
) -> Dict[str, float]:
    aggregate: Dict[str, float] = {}
    for metric_name in metric_names:
        values = [_safe_float(row.get(metric_name)) for row in by_case]
        metric_mean = _mean(values)
        if math.isfinite(metric_mean):
            aggregate[metric_name] = metric_mean
    return aggregate


def main():
    if len(sys.argv) != 3:
        raise RuntimeError("Usage: ragas_runner.py <input_json> <output_json>")

    input_path = sys.argv[1]
    output_path = sys.argv[2]

    with open(input_path, "r", encoding="utf-8") as input_file:
        payload = json.load(input_file)

    samples = payload.get("samples")
    if not isinstance(samples, list) or len(samples) == 0:
        raise RuntimeError("Input payload must include non-empty 'samples' array")

    from ragas import EvaluationDataset  # type: ignore

    metrics, meta = _load_ragas()
    eval_samples = [_build_single_turn_sample(sample) for sample in samples]
    case_ids = [str(sample.get("caseId", "") or "") for sample in samples]
    eval_dataset = EvaluationDataset(samples=eval_samples)
    by_case, metric_errors = _score_cases(eval_dataset.samples, case_ids, metrics)
    aggregate = _compute_aggregate(by_case, METRIC_NAMES)

    if not aggregate:
        if metric_errors:
            details = "; ".join(
                f"{name}: {message}" for name, message in sorted(metric_errors.items())
            )
            raise RuntimeError(
                f"RAGAS evaluation returned no aggregate metrics. Metric errors: {details}"
            )
        raise RuntimeError("RAGAS evaluation returned no aggregate metrics")

    output = {
        "schema": "modern",
        "aggregate": aggregate,
        "byCase": by_case,
        "diagnostics": {"metricErrors": metric_errors},
        "raw": {"meta": meta},
    }

    with open(output_path, "w", encoding="utf-8") as output_file:
        json.dump(_to_json_safe(output), output_file, indent=2, allow_nan=False)


if __name__ == "__main__":
    try:
        main()
    except Exception as err:
        print(str(err), file=sys.stderr)
        sys.exit(1)
