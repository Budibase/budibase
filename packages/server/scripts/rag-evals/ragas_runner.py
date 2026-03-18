#!/usr/bin/env python3
import json
import math
import sys
from typing import Any, Dict, List


METRIC_NAMES = [
    "answer_correctness",
    "answer_relevancy",
    "context_precision",
    "context_recall",
    "faithfulness",
]


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


def _load_ragas():
    try:
        from datasets import Dataset  # type: ignore
        from ragas import evaluate  # type: ignore
    except Exception as err:
        raise RuntimeError(
            "Missing Python deps for RAGAS. Install with: pip install ragas datasets openai"
        ) from err

    return Dataset, evaluate


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

    Dataset, evaluate = _load_ragas()

    rows = {
        "user_input": [sample["question"] for sample in samples],
        "response": [sample["answer"] for sample in samples],
        "retrieved_contexts": [sample.get("contexts", []) for sample in samples],
        "reference": [sample.get("reference", "") or "" for sample in samples],
        "case_id": [sample.get("caseId", "") for sample in samples],
    }

    dataset = Dataset.from_dict(rows)
    result = evaluate(dataset=dataset)

    scores = getattr(result, "scores", None)
    if not isinstance(scores, list):
        raise RuntimeError("RAGAS result.scores is not available")

    by_case = [row for row in scores if isinstance(row, dict)]
    aggregate: Dict[str, float] = {}
    for metric_name in METRIC_NAMES:
        values = [_safe_float(row.get(metric_name)) for row in by_case]
        metric_mean = _mean(values)
        if math.isfinite(metric_mean):
            aggregate[metric_name] = metric_mean

    if not aggregate:
        raise RuntimeError("RAGAS evaluation returned no aggregate metrics")

    output = {
        "schema": "modern",
        "aggregate": aggregate,
        "byCase": by_case,
        "raw": {"repr": repr(result)},
    }

    with open(output_path, "w", encoding="utf-8") as output_file:
        json.dump(_to_json_safe(output), output_file, indent=2, allow_nan=False)


if __name__ == "__main__":
    try:
        main()
    except Exception as err:
        print(str(err), file=sys.stderr)
        sys.exit(1)
