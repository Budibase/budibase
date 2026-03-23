#!/usr/bin/env python3
import json
import math
import sys
from typing import Any, Dict, List, Tuple


def _import_deps():
    try:
        from datasets import Dataset  # type: ignore
        from ragas import evaluate  # type: ignore
        from ragas.metrics import (  # type: ignore
            answer_correctness,
            answer_relevancy,
            context_precision,
            context_recall,
            faithfulness,
        )
    except Exception as err:
        raise RuntimeError(
            "Missing Python deps for RAGAS. Install with: "
            "pip install ragas datasets openai"
        ) from err

    return {
        "Dataset": Dataset,
        "evaluate": evaluate,
        "metrics": {
            "answer_correctness": answer_correctness,
            "answer_relevancy": answer_relevancy,
            "context_precision": context_precision,
            "context_recall": context_recall,
            "faithfulness": faithfulness,
        },
    }


def _safe_float(value: Any) -> float:
    try:
        parsed = float(value)
    except Exception:
        return float("nan")
    if math.isfinite(parsed):
        return parsed
    return float("nan")


def _mean(values: List[float]) -> float:
    valid = [v for v in values if math.isfinite(v)]
    if not valid:
        return float("nan")
    return sum(valid) / len(valid)


def _to_json_safe(value: Any) -> Any:
    if isinstance(value, float):
        if math.isfinite(value):
            return value
        return None
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


def _to_rows(samples: List[Dict[str, Any]], schema: str) -> Dict[str, List[Any]]:
    if schema == "legacy":
        return {
            "question": [row["question"] for row in samples],
            "answer": [row["answer"] for row in samples],
            "contexts": [row.get("contexts", []) for row in samples],
            "ground_truth": [row.get("reference", "") or "" for row in samples],
            "case_id": [row.get("caseId", "") for row in samples],
        }
    return {
        "user_input": [row["question"] for row in samples],
        "response": [row["answer"] for row in samples],
        "retrieved_contexts": [row.get("contexts", []) for row in samples],
        "reference": [row.get("reference", "") or "" for row in samples],
        "case_id": [row.get("caseId", "") for row in samples],
    }


def _evaluate(
    evaluate: Any, Dataset: Any, metrics: Dict[str, Any], rows: Dict[str, List[Any]]
) -> Tuple[Dict[str, float], List[Dict[str, Any]], Dict[str, Any]]:
    metric_list = [
        metrics["answer_correctness"],
        metrics["answer_relevancy"],
        metrics["context_precision"],
        metrics["context_recall"],
        metrics["faithfulness"],
    ]

    dataset = Dataset.from_dict(rows)
    result = evaluate(dataset=dataset, metrics=metric_list)

    pandas_rows: List[Dict[str, Any]] = []
    if hasattr(result, "to_pandas"):
        try:
            frame = result.to_pandas()
            pandas_rows = frame.to_dict(orient="records")
        except Exception:
            pandas_rows = []

    aggregates: Dict[str, float] = {}
    metric_names = [
        "answer_correctness",
        "answer_relevancy",
        "context_precision",
        "context_recall",
        "faithfulness",
    ]

    if pandas_rows:
        for metric_name in metric_names:
            values = [_safe_float(row.get(metric_name)) for row in pandas_rows]
            metric_mean = _mean(values)
            if math.isfinite(metric_mean):
                aggregates[metric_name] = metric_mean

    if not aggregates:
        maybe_dict = {}
        if isinstance(result, dict):
            maybe_dict = result
        elif hasattr(result, "__dict__"):
            maybe_dict = dict(getattr(result, "__dict__", {}))

        for metric_name in metric_names:
            value = _safe_float(maybe_dict.get(metric_name))
            if math.isfinite(value):
                aggregates[metric_name] = value

    return aggregates, pandas_rows, {"repr": repr(result)}


def main():
    if len(sys.argv) != 3:
        raise RuntimeError("Usage: ragas_runner.py <input_json> <output_json>")

    input_path = sys.argv[1]
    output_path = sys.argv[2]

    with open(input_path, "r", encoding="utf-8") as f:
        payload = json.load(f)

    samples = payload.get("samples")
    if not isinstance(samples, list) or len(samples) == 0:
        raise RuntimeError("Input payload must include non-empty 'samples' array")

    deps = _import_deps()
    Dataset = deps["Dataset"]
    evaluate = deps["evaluate"]
    metrics = deps["metrics"]

    errors = []
    for schema in ["legacy", "modern"]:
        try:
            rows = _to_rows(samples, schema)
            aggregates, by_case, raw = _evaluate(evaluate, Dataset, metrics, rows)
            if aggregates:
                with open(output_path, "w", encoding="utf-8") as f:
                    json.dump(
                        _to_json_safe(
                            {
                            "schema": schema,
                            "aggregate": aggregates,
                            "byCase": by_case,
                            "raw": raw,
                            }
                        ),
                        f,
                        indent=2,
                        allow_nan=False,
                    )
                return
            errors.append(f"Schema '{schema}' returned no aggregates")
        except Exception as err:
            errors.append(f"Schema '{schema}' failed: {err}")

    raise RuntimeError("RAGAS evaluation failed. " + " | ".join(errors))


if __name__ == "__main__":
    try:
        main()
    except Exception as err:
        print(str(err), file=sys.stderr)
        sys.exit(1)
