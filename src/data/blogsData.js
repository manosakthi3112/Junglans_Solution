// Real Junglans Solutions Team Authors
const AUTHORS = {
  MANOSAKTHI: {
    name: "Manosakthi Thiyagarajan",
    role: "Founder & Lead AI Architect",
    avatar: "MT",
    color: "#10B981"
  },
  SRI_KANISH: {
    name: "Sri Kanish P",
    role: "Co-Founder & ROS Developer",
    avatar: "SK",
    color: "#059669"
  },
  YASHIKA: {
    name: "Yashika P",
    role: "Founder @ AscendiaEdu & Lead DevOps Engineer",
    avatar: "YP",
    color: "#10B981"
  },
  GOVINDARAJAN: {
    name: "Govindarajan Selvaraj",
    role: "ML Engineer",
    avatar: "GS",
    color: "#059669"
  },
  SURYA: {
    name: "Surya N",
    role: "Full Stack Developer",
    avatar: "SN",
    color: "#10B981"
  },
  VINOTH: {
    name: "Vinoth M",
    role: "Full Stack Developer",
    avatar: "VM",
    color: "#10B981"
  },
  GURUPRASATH: {
    name: "Guruprasath C M",
    role: "Mobile App Developer",
    avatar: "GC",
    color: "#059669"
  },
  AKSHAYA: {
    name: "Akshaya Keerthi A V",
    role: "UI/UX Developer",
    avatar: "AK",
    color: "#10B981"
  },
  SHARMILA: {
    name: "Sharmila S",
    role: "AI Engineer",
    avatar: "SS",
    color: "#059669"
  }
};

export const blogsData = [
  {
    id: "blog-1",
    slug: "classification-metrics-guide",
    title: "Traditional ML Classification Metrics: Confusion Matrix, Accuracy, Precision, Recall & F1-Score",
    subtitle: "A deep dive into confusion matrices, Type I and Type II errors, accuracy paradox on imbalanced data, and harmonic mean F-beta formulations.",
    category: "Machine Learning Foundations",
    publishDate: "August 10, 2026",
    readTime: "9 min read",
    author: AUTHORS.MANOSAKTHI,
    tags: ["Machine Learning", "Classification", "Confusion Matrix", "Precision", "Recall", "F1 Score"],
    featured: true,
    summary: "Classification metrics almost all derive from the confusion matrix. Learn how Accuracy, Precision, Recall, and F1-Score behave under real-world data distributions.",
    content: `
# Traditional ML Evaluation Metrics — Foundations Guide

This document covers the metrics used to evaluate classical machine learning models, organized as classification, regression, and computer vision metrics.

\`\`\`
Traditional ML
├── Classification  → Accuracy, Precision, Recall, F1, ROC-AUC
├── Regression       → MAE, MSE, RMSE, R²
└── Computer Vision  → IoU, Dice, mAP
\`\`\`

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

$$\\text{Accuracy} = \\frac{TP + TN}{TP + TN + FP + FN}$$

Example: (18 + 73) / 100 = **0.91 (91%)**

**When to use:** Balanced classes only. **When to avoid:** Imbalanced datasets — e.g., a fraud detector with 1% fraud rate gets 99% accuracy by predicting "not fraud" every time, which is useless.

\`\`\`python
from sklearn.metrics import accuracy_score
accuracy_score(y_true, y_pred)
\`\`\`

### 1.3 Precision

**Definition:** Of everything predicted positive, how much was actually positive. Answers: "When the model says yes, how often is it right?"

$$\\text{Precision} = \\frac{TP}{TP + FP}$$

Example: 18 / (18 + 7) = **0.72 (72%)**

**When to prioritize:** False positives are costly. E.g., spam filter (don't want real emails marked spam), or a medical test that triggers invasive follow-up procedures on a false alarm.

\`\`\`python
from sklearn.metrics import precision_score
precision_score(y_true, y_pred)
\`\`\`

### 1.4 Recall (Sensitivity / True Positive Rate)

**Definition:** Of everything that was actually positive, how much did the model catch. Answers: "Of all real positives, how many did we find?"

$$\\text{Recall} = \\frac{TP}{TP + FN}$$

Example: 18 / (18 + 2) = **0.90 (90%)**

**When to prioritize:** False negatives are costly. E.g., cancer screening, fraud detection, security threat detection — missing a real case is worse than a false alarm.

\`\`\`python
from sklearn.metrics import recall_score
recall_score(y_true, y_pred)
\`\`\`

### 1.5 F1 Score

**Definition:** Harmonic mean of precision and recall — a single number that balances both. Harmonic mean (not arithmetic) punishes large imbalances between the two.

$$F_1 = 2 \\times \\frac{\\text{Precision} \\times \\text{Recall}}{\\text{Precision} + \\text{Recall}}$$

Example: 2 × (0.72 × 0.90) / (0.72 + 0.90) = **0.80**

**When to use:** You need one summary metric and both false positives and false negatives matter, especially on imbalanced data. There is also a general **F-beta score** where $\\beta$ weights recall $\\beta$ times as important as precision:

$$F_\\beta = (1 + \\beta^2) \\times \\frac{\\text{Precision} \\times \\text{Recall}}{(\\beta^2 \\times \\text{Precision}) + \\text{Recall}}$$

\`\`\`python
from sklearn.metrics import f1_score
f1_score(y_true, y_pred)
\`\`\`
`
  },
  {
    id: "blog-2",
    slug: "roc-auc-multiclass-metrics",
    title: "ROC-AUC Curves, PR-AUC, and Multi-Class Evaluation Metrics",
    subtitle: "Understanding decision threshold curves, Area Under Curve interpretation, PR-AUC vs ROC-AUC on imbalanced datasets, and Macro vs Micro averaging.",
    category: "Machine Learning Foundations",
    publishDate: "August 09, 2026",
    readTime: "8 min read",
    author: AUTHORS.GOVINDARAJAN,
    tags: ["ROC-AUC", "PR-AUC", "Multi-Class", "Machine Learning", "Model Evaluation"],
    featured: false,
    summary: "Explore threshold-agnostic ROC curves, probability ranking, Precision-Recall AUC for rare classes, and multi-class macro, micro, and weighted averaging techniques.",
    content: `
# ROC-AUC Curves & Multi-Class Evaluation Guide

---

## 1. ROC-AUC

**ROC (Receiver Operating Characteristic) curve** plots:
- X-axis: False Positive Rate = FP / (FP + TN)
- Y-axis: True Positive Rate (Recall) = TP / (TP + FN)

...at every possible classification threshold (0.0 to 1.0), instead of just one fixed threshold.

**AUC (Area Under the Curve)** condenses the curve into one number from 0 to 1:
- **1.0** = perfect classifier
- **0.5** = random guessing (diagonal line)
- **< 0.5** = worse than random (model is inverted)

**Interpretation:** AUC is the probability that the model ranks a random positive example higher than a random negative example.

**When to use:** Comparing models independent of a chosen threshold, or when you'll tune the threshold later. **Caution:** Can be misleading on heavily imbalanced datasets — use **PR-AUC** (Precision-Recall AUC) instead in that case, since it doesn't reward performance on the (huge) negative class the way ROC-AUC can.

\`\`\`python
from sklearn.metrics import roc_auc_score
roc_auc_score(y_true, y_pred_proba)  # needs probabilities, not hard labels
\`\`\`

---

## 2. Multi-class Extensions

Precision/Recall/F1 don't have one obvious definition beyond two classes, so they're computed per-class and averaged:
- **Macro average** — average metric across classes, unweighted (treats rare and common classes equally)
- **Micro average** — aggregate TP/FP/FN across all classes first, then compute (dominated by common classes)
- **Weighted average** — average weighted by class support (frequency)

\`\`\`python
from sklearn.metrics import classification_report
print(classification_report(y_true, y_pred, target_names=['Class A', 'Class B', 'Class C']))
\`\`\`
`
  },
  {
    id: "blog-3",
    slug: "regression-computer-vision-metrics",
    title: "Regression & Computer Vision Metrics: MAE, MSE, RMSE, R², IoU, Dice & mAP",
    subtitle: "Evaluating continuous numeric targets and spatial bounding box predictions in detection and segmentation tasks.",
    category: "Machine Learning Foundations",
    publishDate: "August 07, 2026",
    readTime: "9 min read",
    author: AUTHORS.GOVINDARAJAN,
    tags: ["Regression", "Computer Vision", "MAE", "RMSE", "IoU", "mAP", "Dice"],
    featured: false,
    summary: "A practical guide to continuous error metrics (MAE, MSE, RMSE, R²) and computer vision spatial metrics (Intersection over Union, Dice Coefficient, mAP).",
    content: `
# Regression & Computer Vision Metrics — Foundations Guide

---

## 1. Regression Metrics

Used when the target is a continuous number (price, temperature, demand, etc.).

### 1.1 MAE — Mean Absolute Error

$$\\text{MAE} = \\frac{1}{n} \\sum_{i=1}^{n} |y_i - \\hat{y}_i|$$

**Interpretation:** Average magnitude of error, in the same units as the target. Treats all errors linearly — a $10 error counts as exactly 10x a $1 error.

**When to use:** You want an easily interpretable "average miss," and don't want a few big outliers to dominate the score.

\`\`\`python
from sklearn.metrics import mean_absolute_error
mean_absolute_error(y_true, y_pred)
\`\`\`

### 1.2 MSE — Mean Squared Error

$$\\text{MSE} = \\frac{1}{n} \\sum_{i=1}^{n} (y_i - \\hat{y}_i)^2$$

**Interpretation:** Average of squared errors. Squaring penalizes large errors much more than small ones.

**When to use:** Large errors are disproportionately bad in your application or as a training loss function.

### 1.3 RMSE — Root Mean Squared Error

$$\\text{RMSE} = \\sqrt{\\text{MSE}}$$

**Interpretation:** Same "penalize big errors more" behavior as MSE, but back in the original units, making it directly comparable to MAE.

### 1.4 R² — Coefficient of Determination

$$R^2 = 1 - \\frac{\\sum (y_i - \\hat{y}_i)^2}{\\sum (y_i - \\bar{y})^2}$$

**Adjusted R²** penalizes for feature count when comparing models:

$$\\text{Adjusted } R^2 = 1 - \\left[ (1 - R^2) \\times \\frac{n - 1}{n - k - 1} \\right]$$

### 1.5 Quick Comparison Table

| Metric | Penalizes outliers? | Units | Best for |
|---|---|---|---|
| MAE | No (linear) | Same as target | Robust, interpretable average error |
| MSE | Yes (quadratic) | Target² | Training loss, punishing big misses |
| RMSE | Yes (quadratic) | Same as target | Interpretable version of MSE |
| R² | Depends on residuals | Unitless (0–1 typically) | "% of variance explained," model comparison |

---

## 2. Computer Vision Metrics

### 2.1 IoU — Intersection over Union

$$\\text{IoU} = \\frac{\\text{Area of Overlap}}{\\text{Area of Union}}$$

### 2.2 Dice Coefficient (F1 for pixels)

$$\\text{Dice} = \\frac{2 \\times |A \\cap B|}{|A| + |B|}$$

### 2.3 mAP — mean Average Precision

Used in object detection benchmarks (mAP@0.5, mAP@0.5:0.95). Mean of AP across all classes.
`
  },
  {
    id: "blog-4",
    slug: "llm-language-quality-metrics",
    title: "LLM Language Quality Metrics: Perplexity, BLEU, ROUGE & BERTScore Deep Dive",
    subtitle: "Automated measurement of fluency, n-gram precision, recall in summarization, and neural semantic similarity without human raters.",
    category: "LLM Evaluation & Benchmarking",
    publishDate: "August 05, 2026",
    readTime: "9 min read",
    author: AUTHORS.SURYA,
    tags: ["LLM", "Perplexity", "BLEU", "ROUGE", "BERTScore", "NLP"],
    featured: true,
    summary: "How do we automatically measure LLM response quality? Explore probability perplexity, exact string overlap (BLEU/ROUGE), and BERTScore semantic alignment.",
    content: `
# LLM Evaluation Metrics — Language Quality

\`\`\`
LLM Language Quality
├── Perplexity  → Next-token probability surprise
├── BLEU        → N-gram precision & Brevity penalty
├── ROUGE       → N-gram recall & Longest Common Subsequence
└── BERTScore   → Contextual embedding cosine similarity
\`\`\`

---

## 1. Perplexity

**Definition:** How "surprised" a language model is by a sequence of text.

$$\\text{Perplexity} = \\exp\\left( -\\frac{1}{N} \\sum_{i=1}^{N} \\log P(\\text{token}_i \\mid \\text{previous tokens}) \\right)$$

- Lower perplexity = better fit to data distribution.
- A well-trained model on natural English sits in ~10–30 perplexity range.

\`\`\`python
import torch
import torch.nn.functional as F

def perplexity(logits, target_ids):
    log_probs = F.log_softmax(logits, dim=-1)
    token_log_probs = log_probs.gather(1, target_ids.unsqueeze(1)).squeeze(1)
    return torch.exp(-token_log_probs.mean())
\`\`\`

---

## 2. BLEU (Bilingual Evaluation Understudy)

Measures **n-gram precision** with brevity penalty:

$$\\text{BLEU} = \\text{BP} \\times \\exp\\left( \\sum_{n=1}^{N} w_n \\log p_n \\right)$$

Precision-oriented, penalizes extra words. Weak for open-ended chat where paraphrasing is common.

---

## 3. ROUGE (Recall-Oriented Understudy for Gisting Evaluation)

Counterpart to BLEU, recall-oriented for summarization:
- **ROUGE-1** — unigram overlap
- **ROUGE-2** — bigram overlap
- **ROUGE-L** — Longest Common Subsequence overlap

$$\\text{ROUGE-N (Recall)} = \\frac{\\text{matching } n\\text{-grams}}{\\text{n-grams in reference}}$$

---

## 4. BERTScore

Embeds candidate and reference using pretrained models (e.g. BERT/DeBERTa) and calculates **semantic similarity** via cosine distance.

| Metric | Compares | Sensitive to paraphrase? | Typical use |
|---|---|---|---|
| Perplexity | Model probabilities | N/A | Pretraining fit |
| BLEU | Exact n-gram precision | Yes (penalizes) | Translation |
| ROUGE | Exact n-gram recall | Yes (penalizes) | Summarization |
| BERTScore | Semantic embeddings | No (rewards) | QA, Chat |
`
  },
  {
    id: "blog-5",
    slug: "llm-reasoning-g-eval-judge",
    title: "Modern LLM Reasoning Evaluation: LLM-as-a-Judge, G-Eval, Correctness & Hallucinations",
    subtitle: "Replacing human labelers with frontier LLM judges, chain-of-thought rubrics, G-Eval log-probability weighting, and hallucination metrics.",
    category: "LLM Evaluation & Benchmarking",
    publishDate: "August 03, 2026",
    readTime: "10 min read",
    author: AUTHORS.MANOSAKTHI,
    tags: ["LLM-as-a-Judge", "G-Eval", "Faithfulness", "Hallucination", "Benchmarking"],
    featured: false,
    summary: "Discover how top AI labs replace human raters with LLM-as-a-Judge frameworks like G-Eval, evaluating correctness, relevance, and hallucination rates.",
    content: `
# LLM Reasoning & Quality Metrics

---

## 1. Accuracy & Correctness

- **Accuracy:** Fraction of outputs matching ground truth in benchmark suites (MMLU, GSM8K, HumanEval).
- **Correctness:** Whether factual claims in open-ended responses are true, judged via rubrics or LLM judges.

---

## 2. Relevance, Faithfulness & Hallucination

- **Relevance:** Does the response address what was asked without wandering off-topic?
- **Faithfulness:** Is the response strictly consistent with the provided source context?
- **Hallucination:** Rate of fabricated content generated with confidence:
  - **Intrinsic hallucination:** Direct contradiction of source.
  - **Extrinsic hallucination:** Unverifiable information added.

$$\\text{Hallucination Rate} = \\frac{\\text{# claims not supported}}{\\text{# total claims}}$$

---

## 3. Practical Evaluation Methods

1. **Human Evaluation:** Gold standard, slow, expensive.
2. **LLM-as-a-Judge:** Frontier model prompted with query, response, and scoring rubric.
3. **G-Eval Framework:** Generates evaluation steps (CoT) and calculates continuous score via token log-probabilities:

$$\\text{Score} = \\sum_{s=1}^{5} s \\times P(\\text{score} = s)$$
`
  },
  {
    id: "blog-6",
    slug: "llm-rag-production-inference-metrics",
    title: "RAG Evaluation Frameworks & LLM Serving Metrics: TTFT, Throughput, Latency & VRAM Sizing",
    subtitle: "RAGAS triad metrics alongside operational serving parameters: Time To First Token, decode speed, throughput trade-offs, and VRAM memory math.",
    category: "LLM Evaluation & Benchmarking",
    publishDate: "August 01, 2026",
    readTime: "10 min read",
    author: AUTHORS.YASHIKA,
    tags: ["RAG Metrics", "TTFT", "Tokens/sec", "Latency", "Throughput", "VRAM", "DevOps"],
    featured: false,
    summary: "A practical operational guide covering RAG metrics (Context Precision, Recall, Groundedness) and physical serving metrics (TTFT, VRAM sizing, Throughput).",
    content: `
# RAG Evaluation & Production Serving Metrics

---

## 1. RAG-Specific Metrics (RAGAS / TruLens)

| Metric | Evaluates | Failure mode caught |
|---|---|---|
| **Context Precision** | Retriever | Noise / irrelevant retrieved chunks |
| **Context Recall** | Retriever | Missing necessary information |
| **Groundedness** | Generator | Model hallucinating beyond context |
| **Answer Relevancy** | Generator | Answering a different question |

\`\`\`python
from ragas import evaluate
from ragas.metrics import context_precision, context_recall, faithfulness, answer_relevancy

results = evaluate(dataset, metrics=[context_precision, context_recall, faithfulness, answer_relevancy])
\`\`\`

---

## 2. Deployment & Inference Serving Metrics

### 2.1 TTFT — Time To First Token
Latency from request start to token #1 output. Measures user-perceived responsiveness.

### 2.2 Tokens/sec & Latency
Rate of output token generation during decode phase. p50/p90/p99 latency percentiles.

### 2.3 Throughput
Total tokens processed per unit time across concurrent requests:

$$\\text{Throughput} = \\frac{\\text{total tokens across all requests}}{\\text{time}}$$

### 2.4 VRAM Sizing Formula
GPU memory footprint for model weights:

$$\\text{VRAM Weight Size} \\approx \\text{Parameters} \\times \\text{Bytes per Parameter}$$

- FP32: 4 bytes/param
- FP16/BF16: 2 bytes/param (7B model ≈ 14 GB)
- INT8: 1 byte/param (7B model ≈ 7 GB)
- INT4: 0.5 bytes/param (7B model ≈ 3.5 GB)
`
  },
  {
    id: "blog-7",
    slug: "linear-knn-naive-bayes-models",
    title: "Linear Models, Regularization (Ridge/Lasso/ElasticNet), KNN Distance & Naive Bayes",
    subtitle: "Foundational machine learning models: OLS linear regression, logistic classification, L1/L2 penalties, KNN lazy learning, and Naive Bayes.",
    category: "Model Architectures",
    publishDate: "July 29, 2026",
    readTime: "9 min read",
    author: AUTHORS.GOVINDARAJAN,
    tags: ["Linear Models", "Logistic Regression", "Ridge", "Lasso", "KNN", "Naive Bayes"],
    featured: false,
    summary: "Explore linear hyperplanes, sigmoid logistic log-loss, L1 Lasso feature selection, L2 Ridge shrinkage, KNN distance metrics, and Naive Bayes independence assumptions.",
    content: `
# Classical Machine Learning — Linear, Distance & Probabilistic Models

\`\`\`
ML Model Families
├── Linear Models          → Linear Regression, Logistic Regression, Ridge, Lasso, ElasticNet
├── Distance-Based        → K-Nearest Neighbors (KNN)
└── Probabilistic          → Naive Bayes (Gaussian, Multinomial, Bernoulli)
\`\`\`

---

## 1. Linear Models

### 1.1 Linear Regression

$$\\hat{y} = w_1 x_1 + w_2 x_2 + \\dots + w_n x_n + b$$

Learns weights by minimizing MSE via Normal Equation or Gradient Descent.

### 1.2 Logistic Regression

$$P(y=1) = \\frac{1}{1 + e^{-(w \\cdot x + b)}}$$

Classification model minimizing cross-entropy log-loss.

### 1.3 Regularization

- **Ridge (L2):** $\\text{Loss} = \\text{MSE} + \\alpha \\sum w_i^2$ (shrinks weights smoothly).
- **Lasso (L1):** $\\text{Loss} = \\text{MSE} + \\alpha \\sum |w_i|$ (forces uninformative weights to exact zero).
- **ElasticNet:** Combines L1 and L2 penalties.

---

## 2. Distance-Based: KNN

Lazy learner predicting majority class or average of K closest training neighbors. Requires feature standardization.

---

## 3. Probabilistic: Naive Bayes

Applies Bayes' Theorem assuming feature conditional independence:

$$P(\\text{class} \\mid \\text{features}) \\propto P(\\text{class}) \\times \\prod P(\\text{feature}_i \\mid \\text{class})$$

Variants: GaussianNB, MultinomialNB, BernoulliNB. Extremely fast text baseline.
`
  },
  {
    id: "blog-8",
    slug: "tree-models-ensemble-gradient-boosting",
    title: "Tree-Based Architectures & Ensembles: Decision Trees, Random Forests, XGBoost, LightGBM & CatBoost",
    subtitle: "Impurity splitting criteria (Gini, Entropy), bagging variance reduction, and sequential gradient boosting algorithms.",
    category: "Model Architectures",
    publishDate: "July 26, 2026",
    readTime: "11 min read",
    author: AUTHORS.GOVINDARAJAN,
    tags: ["Decision Trees", "Random Forest", "XGBoost", "LightGBM", "CatBoost", "Ensembles"],
    featured: true,
    summary: "Master decision tree split criteria (Gini vs Entropy), Random Forest bagging, and gradient boosted powerhouses like XGBoost, LightGBM, and CatBoost.",
    content: `
# Tree-Based Models & Ensemble Frameworks

---

## 1. Decision Trees

Splits feature space recursively based on split criteria:
- **Gini Impurity:** $G = 1 - \\sum p_k^2$
- **Entropy:** $H = - \\sum p_k \\log_2(p_k)$

Key hyperparameters: \`max_depth\`, \`min_samples_split\`, \`min_samples_leaf\`.

---

## 2. Bagging: Random Forest

Ensemble of independent decision trees trained on bootstrap samples with random feature selection. Reduces model variance without increasing bias.

---

## 3. Gradient Boosting Frameworks

Sequential trees fitting negative gradients of the loss function:

| Model | Split Strategy | Key Strength |
|---|---|---|
| **XGBoost** | Pre-sorted exact / approx splits | Robust, accurate, handles missing data |
| **LightGBM** | Histogram leaf-wise (best-first) | 10x faster training on massive datasets |
| **CatBoost** | Symmetric balanced trees | Superior out-of-the-box categorical feature handling |

\`\`\`python
import xgboost as xgb
model = xgb.XGBClassifier(n_estimators=200, learning_rate=0.05, max_depth=6).fit(X_train, y_train)
\`\`\`
`
  },
  {
    id: "blog-9",
    slug: "svm-clustering-dim-reduction-time-series",
    title: "SVMs, Clustering (K-Means/DBSCAN), Dimensionality Reduction (PCA/t-SNE/UMAP) & Time Series",
    subtitle: "Margin maximization, kernel tricks, unsupervised clustering, manifold visualization, and temporal autoregression.",
    category: "Model Architectures",
    publishDate: "July 24, 2026",
    readTime: "10 min read",
    author: AUTHORS.SRI_KANISH,
    tags: ["SVM", "K-Means", "DBSCAN", "PCA", "t-SNE", "UMAP", "Time Series"],
    featured: false,
    summary: "Explore SVM maximum margin boundaries, unsupervised clustering (K-Means, DBSCAN), dimensionality reduction (PCA, t-SNE, UMAP), and time series models.",
    content: `
# SVMs, Unsupervised Learning & Time Series Reference

---

## 1. Support Vector Machines (SVM)

Finds the optimal decision boundary (hyperplane) maximizing margin distance between classes. Kernel trick (RBF, Polynomial) projects data into higher dimensions for non-linear boundaries.

---

## 2. Unsupervised Clustering

- **K-Means:** Partitions data into K clusters minimizing within-cluster variance. Sensitive to centroid initialization (K-Means++).
- **DBSCAN:** Density-based clustering finding arbitrary shaped clusters without specifying K; identifies noise points.
- **Hierarchical Clustering:** Agglomerative bottom-up tree merging.

---

## 3. Dimensionality Reduction

- **PCA (Principal Component Analysis):** Linear orthogonal projection maximizing feature variance.
- **t-SNE & UMAP:** Non-linear manifold learning preserving local neighborhood structures for high-dimensional data visualization.

---

## 4. Time Series Models

- **ARIMA (AutoRegressive Integrated Moving Average):** Classical linear modeling capturing autoregression (p), differencing (d), and moving average (q).
- **Prophet:** Additive model decomposing trend, seasonality, and holiday effects.
`
  },
  {
    id: "blog-10",
    slug: "building-llms-architecture-tokenization",
    title: "Building Large Language Models: Tokenization (BPE/WordPiece), RoPE Embeddings, Self-Attention & Transformer Blocks",
    subtitle: "The inner mechanics of modern decoder-only language models: tokenizers, rotary embeddings, QKV attention math, RMSNorm, and SwiGLU.",
    category: "LLM Engineering",
    publishDate: "July 20, 2026",
    readTime: "11 min read",
    author: AUTHORS.MANOSAKTHI,
    tags: ["LLM", "Tokenization", "RoPE", "Self-Attention", "Transformer", "RMSNorm", "SwiGLU"],
    featured: true,
    summary: "Uncover how LLMs are engineered: Byte-Pair Encoding, Rotary Position Embeddings (RoPE), Self-Attention QKV matrices, RMSNorm, and SwiGLU activations.",
    content: `
# Building LLMs & Defining Parameters — Foundations Guide

At its core, an LLM is a **Transformer neural network** trained to predict the next token in a sequence, given all previous tokens.

\`\`\`
Text → Tokenizer → Token IDs → Embeddings → Transformer Blocks (×N) → Output Probabilities → Sampled Token
\`\`\`

---

## 1. Tokenization

Splits text into subword units using **BPE (Byte-Pair Encoding)**, **WordPiece**, or **SentencePiece**.
- Example: \`"unbelievable"\` → \`["un", "believ", "able"]\`.
- \`vocab_size\`: 32K–128K+ tokens in modern models.

---

## 2. Embeddings & Positional Information (RoPE)

Token IDs map to vectors of shape \`[vocab_size, d_model]\`. Position is injected via:
- **RoPE (Rotary Position Embedding):** Rotates query/key vectors based on sequence position, generalizing to long sequences better than absolute embeddings.

---

## 3. Self-Attention Mechanism

For every token, computes Query (Q), Key (K), and Value (V) vectors:

$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left( \\frac{Q K^T}{\\sqrt{d_k}} \\right) V$$

- **Multi-Head Attention:** Runs parallel attention heads attending to different syntactic/semantic relationships.
- **Causal Masking:** Enforces autoregressive token generation by masking future positions.

---

## 4. The Transformer Block

Stacked layers containing:
- **RMSNorm:** Faster normalization skipping mean-centering.
- **SwiGLU FFN:** Gated Swish feed-forward network storing parameter knowledge capacity.

$$\\text{RMSNorm}(x) = \\frac{x}{\\sqrt{\\frac{1}{d} \\sum_{i=1}^d x_i^2 + \\epsilon}} \\odot \\gamma$$
`
  },
  {
    id: "blog-11",
    slug: "llm-pretraining-alignment-tuning",
    title: "The End-to-End LLM Pipeline: Pretraining, SFT, RLHF, DPO & LoRA/QLoRA Fine-Tuning",
    subtitle: "Parameter scaling laws (Chinchilla 20 tokens/param), dataset deduplication, instruction tuning, direct preference alignment, and PEFT adapters.",
    category: "LLM Engineering",
    publishDate: "July 16, 2026",
    readTime: "11 min read",
    author: AUTHORS.YASHIKA,
    tags: ["Pretraining", "SFT", "RLHF", "DPO", "LoRA", "QLoRA", "Fine-Tuning"],
    featured: false,
    summary: "From pretraining FLOP scaling laws ($6ND$) to Supervised Fine-Tuning (SFT), DPO alignment, and parameter-efficient fine-tuning with LoRA & 4-bit QLoRA.",
    content: `
# The Full LLM Pipeline & Alignment Guide

---

## 1. Pretraining & Scaling Laws

- **Compute Budget Math:** $\\text{FLOPs} \\approx 6 N D$ (where $N$ = parameters, $D$ = tokens).
- **Chinchilla Scaling:** Optimal training ratio is ~20 tokens per parameter.

---

## 2. Supervised Fine-Tuning (SFT) & Alignment (RLHF / DPO)

1. **SFT:** Fine-tunes pretrained base models on instruction-response pairs.
2. **RLHF vs DPO:** Direct Preference Optimization (DPO) optimizes preference policy directly without PPO reward models:

$$\\mathcal{L}_{DPO} = - \\mathbb{E}_{(x, y_w, y_l)} \\left[ \\log \\sigma \\left( \\beta \\log \\frac{\\pi_\\theta(y_w|x)}{\\pi_{\\text{ref}}(y_w|x)} - \\beta \\log \\frac{\\pi_\\theta(y_l|x)}{\\pi_{\\text{ref}}(y_l|x)} \\right) \\right]$$

---

## 3. Parameter-Efficient Fine-Tuning (LoRA & QLoRA)

**LoRA** freezes base weights $W_0$ and injects low-rank trainable decomposition matrices $A$ and $B$:

$$W = W_0 + \\frac{\\alpha}{r} (B \\times A)$$

**QLoRA** quantizes base model weights to 4-bit NormalFloat (NF4) while maintaining 16-bit LoRA gradients.

\`\`\`python
from peft import LoraConfig, get_peft_model
peft_config = LoraConfig(r=16, lora_alpha=32, target_modules=["q_proj", "v_proj"])
lora_model = get_peft_model(model, peft_config)
\`\`\`
`
  },
  {
    id: "blog-12",
    slug: "llm-inference-hyperparameters-sampling",
    title: "LLM Inference Hyperparameters: Temperature, Top-P Nucleus, Top-K, Repetition Penalty & Context Windows",
    subtitle: "Controlling text generation probability distributions, logits scaling, nucleus sampling, stop sequences, and context length extension.",
    category: "LLM Engineering",
    publishDate: "July 14, 2026",
    readTime: "9 min read",
    author: AUTHORS.SURYA,
    tags: ["Hyperparameters", "Temperature", "Top-P", "Top-K", "Inference", "Sampling"],
    featured: false,
    summary: "Master decoding parameters: Temperature logits scaling, Top-P nucleus sampling, Top-K truncation, Repetition Penalties, and system prompt engineering.",
    content: `
# LLM Inference & Sampling Hyperparameters

---

## 1. Sampling Parameters

### 1.1 Temperature
Scales logits prior to Softmax:

$$P(w_i) = \\frac{\\exp(z_i / T)}{\\sum \\exp(z_j / T)}$$

- **$T \\rightarrow 0$:** Greedy decoding (deterministic math/code).
- **$T = 0.7 - 1.0$:** Creative text generation.

### 1.2 Top-P (Nucleus Sampling)
Samples from the smallest set of top tokens whose cumulative probability exceeds $P$ (e.g. $P = 0.90$).

### 1.3 Top-K & Repetition Penalty
- **Top-K:** Limits candidate pool to fixed $K$ highest probability tokens.
- **Repetition Penalty:** Penalizes logits of previously generated tokens (1.05–1.15).

---

## 2. Context Window & System Prompts

- **Max Tokens:** Upper bound on output generation length.
- **Stop Sequences:** Custom string triggers ending generation immediately.
- **System Prompts:** Highest priority instructions guiding model role and boundaries.
`
  },
  {
    id: "blog-13",
    slug: "rag-foundations-parsing-chunking",
    title: "Retrieval-Augmented Generation (RAG) Foundations: Document Layout Parsing & Chunking Strategies",
    subtitle: "Converting raw document sources into structured text, fixed vs semantic chunking strategies, and small-to-big parent retrieval.",
    category: "RAG & Knowledge Retrieval",
    publishDate: "July 08, 2026",
    readTime: "10 min read",
    author: AUTHORS.GOVINDARAJAN,
    tags: ["RAG", "Chunking", "Document Parsing", "Semantic Chunking", "Indexing"],
    featured: false,
    summary: "A deep dive into document ingestion: PDF layout structure parsing, fixed-size vs semantic chunking, and small-to-big parent document retrieval.",
    content: `
# RAG Foundations — Document Parsing & Chunking

\`\`\`
Indexing Pipeline
Raw Docs → Parsing → Chunking → Embeddings → Vector Database
\`\`\`

---

## 1. Why RAG Exists

LLM knowledge is frozen at training cutoff. RAG retrieves relevant information from external data stores at query time, turning the LLM into an open-book exam taker.

---

## 2. Chunking Taxonomy

- **Fixed-Size Chunking:** Splits every $N$ tokens with overlap (e.g. 500 tokens with 50 overlap).
- **Recursive Chunking:** Splits along hierarchical structural separators (paragraphs → sentences → words).
- **Semantic Chunking:** Starts a new chunk whenever sentence embedding cosine similarity drops.
- **Small-to-Big Retrieval:** Searches small chunks (100 tokens) for vector precision, but passes the parent section (1,000 tokens) to the LLM for context.

\`\`\`python
from langchain_text_splitters import RecursiveCharacterTextSplitter
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = splitter.split_text(document_text)
\`\`\`
`
  },
  {
    id: "blog-14",
    slug: "rag-embeddings-vector-databases-indexing",
    title: "Dense Vector Embeddings & Vector Store Indexing: HNSW, IVF & Product Quantization",
    subtitle: "Contrastive embedding models, asymmetric search, Approximate Nearest Neighbor (ANN) indexing, HNSW graphs, and vector compression.",
    category: "RAG & Knowledge Retrieval",
    publishDate: "July 04, 2026",
    readTime: "10 min read",
    author: AUTHORS.YASHIKA,
    tags: ["Embeddings", "Vector DB", "HNSW", "IVF", "Product Quantization", "ANN Search"],
    featured: false,
    summary: "Understand dense vector embeddings, contrastive training, ANN search indexing (HNSW graphs, IVF Voronoi cells), and Product Quantization (PQ).",
    content: `
# Dense Embeddings & Vector Database Indexing

---

## 1. Embedding Models

Dense numeric vectors representing semantic meaning. Trained via contrastive learning to bring related query-passage pairs closer in vector space.

- **Asymmetric Search:** Query is short ("what is RAG?"), passage is long (500 tokens).

---

## 2. Vector DBs & ANN Indexing

Brute-force $O(N)$ comparison fails at scale. Vector databases use **Approximate Nearest Neighbor (ANN)** indexing:

| Index Type | Mechanics | Trade-Off |
|---|---|---|
| **HNSW (Hierarchical Navigable Small World)** | Multi-layer proximity graph | Sub-millisecond $O(\\log N)$ search, high RAM usage |
| **IVF (Inverted File Index)** | Partitions vector space into Voronoi cells | Lower memory consumption, requires index training |
| **PQ (Product Quantization)** | Vector byte compression | 80%+ memory savings, slight recall drop |

Distance metrics: Cosine Similarity, Dot Product, Euclidean ($L_2$) Distance.
`
  },
  {
    id: "blog-15",
    slug: "advanced-rag-reranking-hyde-triad",
    title: "Advanced RAG Architectures: Hybrid Search (BM25+Dense), Cross-Encoder Re-Ranking, HyDE & The RAG Triad",
    subtitle: "Production RAG optimization: Reciprocal Rank Fusion (RRF), Cross-Encoder self-attention re-rankers, HyDE, and the RAG Triad evaluation.",
    category: "RAG & Knowledge Retrieval",
    publishDate: "July 01, 2026",
    readTime: "11 min read",
    author: AUTHORS.MANOSAKTHI,
    tags: ["Advanced RAG", "Hybrid Search", "BM25", "Re-Ranking", "HyDE", "RAG Triad"],
    featured: true,
    summary: "Production-grade RAG: combine sparse BM25 with dense vectors via RRF, re-rank with Cross-Encoders, leverage HyDE, and evaluate using the RAG Triad.",
    content: `
# Advanced RAG Architectures & Evaluation

Basic vector retrieval often fails when users query exact model numbers, acronyms, or complex questions. Production RAG relies on hybrid search, re-ranking, and formal evaluation frameworks.

---

## 1. Hybrid Search & Reciprocal Rank Fusion (RRF)

Combines sparse BM25 keyword matching with dense vector search:

$$\\text{RRF Score}(d \\in D) = \\sum_{m \\in M} \\frac{1}{k + r_m(d)}$$

where $r_m(d)$ is document $d$'s rank in retriever $m$, and $k \\approx 60$ is a smoothing constant.

\`\`\`
User Query ──┬──> [ Dense Vector Retrieval (HNSW) ] ──> Rank List A ──┐
             │                                                        ├──> [ RRF Fusion ] ──> Top-K
             └──> [ Sparse Keyword Retrieval (BM25) ] ──> Rank List B ──┘
\`\`\`

---

## 2. Cross-Encoder Re-Ranking

Bi-encoders generate query and document vectors independently. A **Cross-Encoder** processes the query and candidate chunk jointly through full self-attention, re-ranking top 50 candidates down to top 5.

---

## 3. HyDE (Hypothetical Document Embeddings)

Prompts an LLM to generate a hypothetical answer first, embeds the answer, and searches the vector store for matching document chunks.

---

## 4. The RAG Triad Evaluation Framework

- **Context Precision:** Fraction of retrieved chunks relevant to query.
- **Context Recall:** Fraction of necessary facts present in context.
- **Groundedness (Faithfulness):** Fraction of claims in answer supported by context.
- **Answer Relevancy:** How directly the output answers the user query.

\`\`\`python
from sentence_transformers import CrossEncoder
reranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')
scores = reranker.predict([[query, chunk] for chunk in candidate_chunks])
\`\`\`
`
  }
];
