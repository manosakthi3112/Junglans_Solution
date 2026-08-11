# Traditional ML Evaluation Metrics — Foundations Guide

This document covers the metrics used to evaluate classical machine learning models, organized as:

```
Traditional ML
├── Classification  → Accuracy, Precision, Recall, F1, ROC-AUC
├── Regression       → MAE, MSE, RMSE, R²
└── Computer Vision  → IoU, Dice, mAP
```

---

## 1. Classification Metrics

Classification metrics almost all derive from the **confusion matrix**, so start there.

### 1.1 The Confusion Matrix

For a binary classifier predicting "positive" vs "negative":

| | Predicted Positive | Predicted Negative |
|---|---|---|
| **Actual Positive** | True Positive (TP) | False Negative (FN) |
| **Actual Negative** | False Positive (FP) | True Negative (TN) |

- **TP** — model correctly predicted positive
- **TN** — model correctly predicted negative
- **FP** ("Type I error") — model predicted positive, actually negative
- **FN** ("Type II error") — model predicted negative, actually positive

Example dataset: 100 emails, 20 are spam (positive class). A spam filter predicts 25 as spam; 18 of those are truly spam.

- TP = 18, FP = 7, FN = 2, TN = 73

### 1.2 Accuracy

**Definition:** Fraction of total predictions that were correct.

```
Accuracy = (TP + TN) / (TP + TN + FP + FN)
```

Example: (18 + 73) / 100 = **0.91 (91%)**

**When to use:** Balanced classes only. **When to avoid:** Imbalanced datasets — e.g., a fraud detector with 1% fraud rate gets 99% accuracy by predicting "not fraud" every time, which is useless.

```python
from sklearn.metrics import accuracy_score
accuracy_score(y_true, y_pred)
```

### 1.3 Precision

**Definition:** Of everything predicted positive, how much was actually positive. Answers: "When the model says yes, how often is it right?"

```
Precision = TP / (TP + FP)
```

Example: 18 / (18 + 7) = **0.72 (72%)**

**When to prioritize:** False positives are costly. E.g., spam filter (don't want real emails marked spam), or a medical test that triggers invasive follow-up procedures on a false alarm.

```python
from sklearn.metrics import precision_score
precision_score(y_true, y_pred)
```

### 1.4 Recall (Sensitivity / True Positive Rate)

**Definition:** Of everything that was actually positive, how much did the model catch. Answers: "Of all real positives, how many did we find?"

```
Recall = TP / (TP + FN)
```

Example: 18 / (18 + 2) = **0.90 (90%)**

**When to prioritize:** False negatives are costly. E.g., cancer screening, fraud detection, security threat detection — missing a real case is worse than a false alarm.

```python
from sklearn.metrics import recall_score
recall_score(y_true, y_pred)
```

### 1.5 F1 Score

**Definition:** Harmonic mean of precision and recall — a single number that balances both. Harmonic mean (not arithmetic) punishes large imbalances between the two.

```
F1 = 2 × (Precision × Recall) / (Precision + Recall)
```

Example: 2 × (0.72 × 0.90) / (0.72 + 0.90) = **0.80**

**When to use:** You need one summary metric and both false positives and false negatives matter, especially on imbalanced data. There is also a general **F-beta score** where β weights recall β times as important as precision:

```
F_beta = (1 + β²) × (Precision × Recall) / (β² × Precision + Recall)
```

```python
from sklearn.metrics import f1_score
f1_score(y_true, y_pred)
```

### 1.6 ROC-AUC

**ROC (Receiver Operating Characteristic) curve** plots:
- X-axis: False Positive Rate = FP / (FP + TN)
- Y-axis: True Positive Rate (Recall) = TP / (TP + FN)

...at every possible classification threshold (0.0 to 1.0), instead of just one fixed threshold like the metrics above.

**AUC (Area Under the Curve)** condenses the curve into one number from 0 to 1:
- **1.0** = perfect classifier
- **0.5** = random guessing (diagonal line)
- **< 0.5** = worse than random (model is inverted)

**Interpretation:** AUC is the probability that the model ranks a random positive example higher than a random negative example.

**When to use:** Comparing models independent of a chosen threshold, or when you'll tune the threshold later. **Caution:** Can be misleading on heavily imbalanced datasets — use **PR-AUC** (Precision-Recall AUC) instead in that case, since it doesn't reward performance on the (huge) negative class the way ROC-AUC can.

```python
from sklearn.metrics import roc_auc_score
roc_auc_score(y_true, y_pred_proba)  # needs probabilities, not hard labels
```

### 1.7 Multi-class Extensions

Precision/Recall/F1 don't have one obvious definition beyond two classes, so they're computed per-class and averaged:
- **Macro average** — average metric across classes, unweighted (treats rare and common classes equally)
- **Micro average** — aggregate TP/FP/FN across all classes first, then compute (dominated by common classes)
- **Weighted average** — average weighted by class support (frequency)

---

## 2. Regression Metrics

Used when the target is a continuous number (price, temperature, demand, etc.).

### 2.1 MAE — Mean Absolute Error

```
MAE = (1/n) × Σ |y_actual − y_predicted|
```

**Interpretation:** Average magnitude of error, in the same units as the target. Treats all errors linearly — a $10 error counts as exactly 10x a $1 error.

**When to use:** You want an easily interpretable "average miss," and don't want a few big outliers to dominate the score.

```python
from sklearn.metrics import mean_absolute_error
mean_absolute_error(y_true, y_pred)
```

### 2.2 MSE — Mean Squared Error

```
MSE = (1/n) × Σ (y_actual − y_predicted)²
```

**Interpretation:** Average of squared errors. Squaring penalizes large errors much more than small ones (a $10 error contributes 100x a $1 error, not 10x). Units are the target's units *squared*, which hurts interpretability.

**When to use:** Large errors are disproportionately bad in your application (e.g., a big miss in demand forecasting causes stockouts), or as a loss function during training (MSE is differentiable everywhere, which is convenient for gradient descent).

```python
from sklearn.metrics import mean_squared_error
mean_squared_error(y_true, y_pred)
```

### 2.3 RMSE — Root Mean Squared Error

```
RMSE = √MSE
```

**Interpretation:** Same "penalize big errors more" behavior as MSE, but back in the original units, making it directly comparable to MAE. RMSE ≥ MAE always; the gap between them tells you how much your errors vary in size (a big gap means a few large outlier errors).

```python
import numpy as np
rmse = np.sqrt(mean_squared_error(y_true, y_pred))
```

### 2.4 R² — Coefficient of Determination

```
R² = 1 − (SS_residual / SS_total)

SS_residual = Σ (y_actual − y_predicted)²
SS_total    = Σ (y_actual − y_mean)²
```

**Interpretation:** Fraction of variance in the target explained by the model, relative to just predicting the mean every time.
- **R² = 1** → perfect predictions
- **R² = 0** → model is no better than predicting the average
- **R² < 0** → model is worse than predicting the average (yes, this happens, especially on new/test data)

**Caveat:** R² always increases (or stays flat) as you add more features, even useless ones — use **Adjusted R²** to penalize for feature count when comparing models with different numbers of predictors:

```
Adjusted R² = 1 − [(1 − R²) × (n − 1) / (n − k − 1)]
```
where n = number of samples, k = number of predictors.

```python
from sklearn.metrics import r2_score
r2_score(y_true, y_pred)
```

### 2.5 Quick Comparison Table

| Metric | Penalizes outliers? | Units | Best for |
|---|---|---|---|
| MAE | No (linear) | Same as target | Robust, interpretable average error |
| MSE | Yes (quadratic) | Target² | Training loss, punishing big misses |
| RMSE | Yes (quadratic) | Same as target | Interpretable version of MSE |
| R² | Depends on residuals | Unitless (0–1 typically) | "% of variance explained," model comparison |

---

## 3. Computer Vision Metrics

Used for object detection, segmentation, and localization tasks.

### 3.1 IoU — Intersection over Union

**Definition:** Measures overlap between a predicted bounding box (or mask) and the ground-truth box.

```
IoU = Area of Overlap / Area of Union
```

- IoU = 1.0 → perfect overlap
- IoU = 0.0 → no overlap at all

**Usage:** A detection is usually counted as "correct" if IoU exceeds a threshold (commonly 0.5). Used as the building block for mAP (below).

```python
def iou(boxA, boxB):
    # box = [x1, y1, x2, y2]
    xA = max(boxA[0], boxB[0])
    yA = max(boxA[1], boxB[1])
    xB = min(boxA[2], boxB[2])
    yB = min(boxA[3], boxB[3])
    inter = max(0, xB - xA) * max(0, yB - yA)
    areaA = (boxA[2]-boxA[0]) * (boxA[3]-boxA[1])
    areaB = (boxB[2]-boxB[0]) * (boxB[3]-boxB[1])
    return inter / float(areaA + areaB - inter)
```

### 3.2 Dice Coefficient (F1 for pixels)

**Definition:** Common in medical image segmentation. Similar to IoU but weights overlap more heavily.

```
Dice = 2 × |A ∩ B| / (|A| + |B|)
```

Relationship to IoU: `Dice = 2×IoU / (1+IoU)`. Dice is mathematically equivalent to the F1 score applied at the pixel level (precision and recall over pixels).

**When to use:** Segmentation tasks (e.g., tumor boundary segmentation), especially with small/thin structures where IoU is overly harsh.

```python
def dice_coefficient(maskA, maskB):
    intersection = (maskA * maskB).sum()
    return 2 * intersection / (maskA.sum() + maskB.sum())
```

### 3.3 mAP — mean Average Precision

The standard metric for object detection (used in COCO, Pascal VOC benchmarks).

**Build-up:**
1. For a given class and IoU threshold, sort predictions by confidence score.
2. Walk down the sorted list, computing precision and recall at each point → this traces out a **precision-recall curve**.
3. **Average Precision (AP)** = area under that precision-recall curve for one class.
4. **mAP** = mean of AP across all classes.

Variants you'll see reported:
- **mAP@0.5** — AP computed at a fixed IoU threshold of 0.5 (looser, "did you roughly find it")
- **mAP@0.5:0.95** — averaged over IoU thresholds from 0.5 to 0.95 in steps of 0.05 (the COCO standard; stricter, rewards precise localization)

**Interpretation:** Higher mAP = model detects objects accurately (right class) *and* localizes them precisely (tight boxes) *and* doesn't over- or under-predict.

```python
# In practice, use a library rather than hand-rolling this:
# torchmetrics.detection.mean_ap.MeanAveragePrecision
from torchmetrics.detection import MeanAveragePrecision
metric = MeanAveragePrecision()
metric.update(preds, targets)
print(metric.compute())
```

---

## 4. Choosing the Right Metric — Quick Reference

| Task | Balanced data | Imbalanced data |
|---|---|---|
| Classification | Accuracy, F1, ROC-AUC | Precision, Recall, F1, PR-AUC |
| Regression | RMSE, R² | MAE (robust to outliers), R² |
| Detection | mAP@0.5:0.95 | Same, plus per-class AP |
| Segmentation | Dice, IoU | Dice (more forgiving on small regions) |

**Rule of thumb:** Never rely on a single metric in production. Report a pair (e.g., Precision + Recall, or MAE + R²) so you can see the trade-off, not just one number that can be gamed.
