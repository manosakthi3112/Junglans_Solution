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
  },
  {
    id: "blog-16",
    slug: "physical-ai-vla-humanoid-robotics",
    title: "Physical AI & Humanoid Robotics: The Convergence of Vision-Language-Action (VLA) Models and End-to-End Motor Control",
    subtitle: "How Figure 02, Tesla Optimus Gen 2, and DeepMind RT-2 are replacing classical inverse kinematics with multimodal Vision-Language-Action (VLA) transformer models.",
    category: "Physical AI & Humanoids",
    publishDate: "September 12, 2026",
    readTime: "12 min read",
    author: AUTHORS.SRI_KANISH,
    tags: ["Physical AI", "Humanoid Robotics", "VLA Models", "RT-2", "Figure 02", "End-to-End Control"],
    featured: true,
    summary: "Explore how Vision-Language-Action (VLA) models unify high-level semantic reasoning with low-level torque commands, revolutionizing humanoid bipedal locomotion and dexterous manipulation.",
    content: `
# Physical AI & Humanoid Robotics: The Rise of VLA Models

The robotics paradigm is undergoing its most radical transformation since the advent of ROS. Classical robotics relied on a strict pipelined architecture: Perception $\\rightarrow$ State Estimation $\\rightarrow$ Motion Planning $\\rightarrow$ Inverse Kinematics $\\rightarrow$ Motor Control.

Today, **Physical AI** is unifying this entire stack through **Vision-Language-Action (VLA)** models.

\`\`\`
Classical Pipeline:
Camera ──> Object Detector ──> Pose Estimator ──> Motion Planner (OMPL) ──> IK Solver ──> Joint Motor

Physical AI (VLA Pipeline):
Camera + Goal String ──> Multimodal Transformer (VLA) ──> Continuous Joint Velocity/Torque
\`\`\`

---

## 1. What are Vision-Language-Action (VLA) Models?

Pioneered by Google DeepMind's RT-1, RT-2, and open-source models like OpenVLA and Octo, VLAs treat robotic actions as tokens in an autoregressive language model.

$$\\mathbf{a}_t = f_{\\theta}(\\mathbf{o}_t, \\mathbf{l})$$

Where $\\mathbf{o}_t$ represents the visual observation (RGB-D feed), $\\mathbf{l}$ is the natural language command (e.g., *"Grasp the aluminum bracket and place it in bin 3"*), and $\\mathbf{a}_t$ is the 7-DoF or 14-DoF end-effector trajectory.

### Action Tokenization
Continuous joint angles $\\theta_i \\in [-180^\\circ, 180^\\circ]$ are discretized into 256 uniform bins:

$$\\text{Token}(\\theta) = \\left\\lfloor \\frac{\\theta - \\theta_{\\min}}{\\theta_{\\max} - \\theta_{\\min}} \\times 255 \\right\\rfloor$$

This allows standard transformer decoders with cross-entropy loss to predict physical robot movements directly.

---

## 2. Real-World Case Studies: Figure 02 & Tesla Optimus Gen 2

- **Figure 02 (BMW Spartanburg Trial):** Running speech-to-speech visual reasoning on custom edge GPUs. The robot recognizes sheet metal placement defects in real time and adjusts hand grasping compliance.
- **Tesla Optimus Gen 2:** Uses custom 11-DoF hands with integrated tactile sensors on every fingertip. Training is performed using teleoperation datasets collected through VR mocap suits and scaled through neural network imitation learning.

---

## 3. High-Frequency Motor Execution Challenges

While VLAs generate high-level plans at 5 Hz to 10 Hz, joint torque loops demand 500 Hz to 1000 Hz. We resolve this using a **Hierarchical VLA Architecture**:

\`\`\`
VLA Transformer (5 Hz) ──> Action Chunk (10-step trajectory) ──> Cubic Spline Interpolator ──> Motor Driver (1000 Hz)
\`\`\`

\`\`\`python
import numpy as np

def generate_motor_spline(action_chunk, dt_high_level=0.2, dt_low_level=0.001):
    """Interpolates 5Hz VLA chunk to 1000Hz motor trajectory."""
    time_high = np.arange(len(action_chunk)) * dt_high_level
    time_low = np.arange(0, time_high[-1], dt_low_level)
    
    smooth_trajectory = np.interp(time_low, time_high, action_chunk)
    return smooth_trajectory
\`\`\`
`
  },
  {
    id: "blog-17",
    slug: "ros2-realtime-dds-zerocopy-embedded",
    title: "ROS 2 Humble & Jazzy in Production: Real-Time DDS Middleware, Zero-Copy IPC & Micro-ROS for Joint Actuators",
    subtitle: "Architectural comparison of CycloneDDS vs FastDDS, iceoryx shared memory zero-copy pipelines, deterministic executors, and micro-ROS on STM32/ESP32 microcontrollers.",
    category: "Robotics Systems & ROS",
    publishDate: "September 08, 2026",
    readTime: "10 min read",
    author: AUTHORS.SRI_KANISH,
    tags: ["ROS 2", "DDS Middleware", "Zero-Copy IPC", "Micro-ROS", "Embedded Systems", "Actuators"],
    featured: false,
    summary: "A production guide to configuring ROS 2 Humble and Jazzy for real-time robotic control: DDS tuning, iceoryx shared memory, and Micro-ROS bridging microcontrollers to the robot compute brain.",
    content: `
# ROS 2 in Production: Real-Time Middleware & Zero-Copy Pipelines

Moving from prototype robotics scripts to high-speed commercial hardware requires absolute determinism. In high-DoF robotic arms or mobile manipulators, serializing heavy sensor feeds (such as 4K stereo cameras and 3D LiDAR point clouds) over standard network stacks introduces unacceptable jitter.

---

## 1. DDS Middleware Comparison: CycloneDDS vs FastDDS

Data Distribution Service (DDS) is the communication backbone of ROS 2.

| Feature | Eclipse CycloneDDS | eProsima FastDDS |
|---|---|---|
| **Best Used For** | Real-time determinism & minimal jitter | High-throughput sensor streams & Discovery Server |
| **Shared Memory** | Integrated iceoryx support | Shared Memory Transport (SHM) built-in |
| **Configuration** | cyclone_config.xml | USER_QOS_PROFILES.xml |
| **Multi-Robot Domain Isolation** | Strict Domain IDs | Discovery Server recommended |

### Configuring CycloneDDS for Minimal Latency:
\`\`\`xml
<?xml version="1.0" encoding="UTF-8" ?>
<CycloneDDS xmlns="https://cdds.io/config">
  <Domain id="any">
    <General>
      <NetworkInterfaceAddress>auto</NetworkInterfaceAddress>
      <AllowMulticast>false</AllowMulticast>
    </General>
    <Internal>
      <Watermarks>
        <WhcHigh>500kB</WhcHigh>
      </Watermarks>
    </Internal>
  </Domain>
</CycloneDDS>
\`\`\`

---

## 2. Zero-Copy IPC with Eclipse iceoryx

Standard ROS 2 inter-process communication copies messages:
Publisher $\\rightarrow$ Middleware buffer $\\rightarrow$ Socket buffer $\\rightarrow$ Subscriber.

With **iceoryx zero-copy**, both processes share a mapped memory segment. Messages are published by transferring 64-bit memory pointers, achieving **< 15 microseconds transfer latency** regardless of payload size (even for 20MB point clouds).

\`\`\`
[ Publisher Node ] ──Writes Data──> [ Shared Memory Segment (iceoryx) ]
                                          ▲
                                     Direct Pointer
                                          │
                               [ Subscriber Node ]
\`\`\`

---

## 3. Bridging Microcontrollers with Micro-ROS

Micro-ROS brings the ROS 2 ecosystem to bare-metal microcontrollers (STM32, Teensy 4.1, ESP32-S3).

\`\`\`c
#include <rcl/rcl.h>
#include <rclc/rclc.h>
#include <std_msgs/msg/float32.h>

// Micro-ROS Joint Sensor Publisher on STM32
rcl_publisher_t publisher;
std_msgs__msg__Float32 msg;

void publish_encoder_angle(float angle) {
    msg.data = angle;
    rcl_publish(&publisher, &msg, NULL);
}
\`\`\`
`
  },
  {
    id: "blog-18",
    slug: "reasoning-models-autonomous-robotics-planning",
    title: "Reasoning Models in Autonomous Robotics: Combining Test-Time Compute (o1 & DeepSeek-R1) with 100Hz Trajectory Planning",
    subtitle: "Hierarchical robotic architecture: High-level tree-search reasoning for task decomposition paired with deterministic local trajectory controllers to eliminate kinematic hallucinations.",
    category: "Robotics & Cognitive AI",
    publishDate: "September 04, 2026",
    readTime: "11 min read",
    author: AUTHORS.MANOSAKTHI,
    tags: ["Reasoning Models", "Test-Time Compute", "Robotic Planning", "DeepSeek-R1", "Motion Control"],
    featured: true,
    summary: "Discover how test-time compute reasoning models solve complex multi-step robotic reasoning without risking catastrophic physical collisions.",
    content: `
# Reasoning Models in Robotics: Bridging Cognitive Search and Physical Execution

The arrival of chain-of-thought reasoning models (such as OpenAI o1 and DeepSeek-R1) represents a breakthrough for high-level autonomous planning. However, running a multi-second test-time compute model directly on a robotic actuator loop is disastrous: robots will tip over or crash into obstacles while the model 'thinks'.

The solution is a **Dual-System Cognitive Architecture**.

---

## 1. System 1 vs. System 2 in Autonomous Systems

Borrowing from Kahneman's cognitive framework:

- **System 2 (Slow, Deep Reasoning):** Executes on edge servers or local workstation GPUs. Generates symbolic behavior trees, verifies geometric affordances, and generates task DAGs (Directed Acyclic Graphs).
- **System 1 (Fast, Reactive Controller):** Runs at 100 Hz on embedded robot hardware. Executes dynamic obstacle avoidance, reactive impedance control, and reflex halts.

\`\`\`
[ User Request ] ──> System 2 (Reasoning LLM / DeepSeek-R1) ──> Emits JSON Behavior Tree
                                                                      │
                                                                      ▼
[ Reflex Controller (100Hz) ] <── Validates Joint Torques <── System 1 (MPC / OMPL)
\`\`\`

---

## 2. Preventing Kinematic Hallucinations

Reasoning models often suggest spatially impossible actions (e.g., *"reach through the transparent glass shelf"*). We enforce **Geometric Affordance Validation**:

\`\`\`python
def validate_robot_task_plan(plan, urdf_model, point_cloud):
    """
    Validates model plan against physical kinematics and collision geometries
    prior to executing any joint motion.
    """
    for step in plan.steps:
        target_pose = step.target_pose
        ik_solution = urdf_model.inverse_kinematics(target_pose)
        
        if not ik_solution.is_valid:
            return False, f"Kinematic reachability failed at step {step.id}"
            
        if point_cloud.check_collision(ik_solution.joint_angles):
            return False, f"Collision detected at step {step.id}"
            
    return True, "Plan physically verified"
\`\`\`

---

## 3. Real-World Application: Autonomous Lab Chemistry

In automated pharmaceutical laboratories, robots must handle fragile pipettes, centrifuge machines, and reagent vials. System 2 decomposes the scientific protocol, while System 1 executes force-feedback torque limits, guaranteeing zero tube breakage.
`
  },
  {
    id: "blog-19",
    slug: "edge-ai-quadruped-locomotion-tensorrt-jetson",
    title: "Edge AI for Quadruped & Bipedal Locomotion: 500Hz Policy Inference on NVIDIA Jetson Orin with INT8 TensorRT",
    subtitle: "Deploying reinforcement learning policies directly on Unitree and ANYmal robot dogs: low-latency IMU state estimation, INT8 quantization, and hardware thermal management.",
    category: "Edge AI & Locomotion",
    publishDate: "August 30, 2026",
    readTime: "9 min read",
    author: AUTHORS.SRI_KANISH,
    tags: ["Quadruped Robots", "Jetson Orin", "TensorRT", "Reinforcement Learning", "Edge Inference"],
    featured: false,
    summary: "Step-by-step guide to compiling and deploying PyTorch RL locomotion policies to NVIDIA Jetson Orin at 500Hz with INT8 TensorRT quantization for dynamic terrain traversal.",
    content: `
# Edge AI for Quadruped Locomotion: 500Hz Policy Inference on Jetson Orin

Quadruped robots (such as the Unitree Go2, B2, and ANYmal) rely on Reinforcement Learning (RL) policies trained in massively parallel simulators. However, porting an RL policy trained on an RTX 4090 cluster to an embedded edge computer like the **NVIDIA Jetson Orin Nano** requires strict latency optimization.

---

## 1. The Locomotion Control Loop

To stabilize a robot dog on slippery mud, rocky steps, or stairs, the policy must process:
- IMU angular velocities $(w_x, w_y, w_z)$
- Gravity projection vectors $(g_x, g_y, g_z)$
- Joint positions and velocities $(\\theta_{1..12}, \\dot{\\theta}_{1..12})$
- Previous action history $(\\mathbf{a}_{t-1}, \\mathbf{a}_{t-2})$

$$\\text{Total State Vector Dimension} \\approx 48 \\text{ dimensions}$$

The policy network outputs 12 target joint positions at **500 Hz (every 2 milliseconds)**.

---

## 2. INT8 Quantization with TensorRT

Standard PyTorch models execute in 32-bit floating point (FP32), consuming ~12ms per forward pass on edge hardware. By compiling to INT8 using NVIDIA TensorRT:

- Latency drops from **11.8 ms $\\rightarrow$ 1.2 ms**
- Memory footprint drops from **140 MB $\\rightarrow$ 18 MB**
- Power draw drops from **22W $\\rightarrow$ 9.5W** (extending battery life by 40 minutes)

\`\`\`python
import tensorrt as trt

def build_engine_int8(onnx_file_path, engine_file_path, calibrator):
    logger = trt.Logger(trt.Logger.WARNING)
    builder = trt.Builder(logger)
    config = builder.create_builder_config()
    
    config.set_flag(trt.BuilderFlag.INT8)
    config.int8_calibrator = calibrator
    
    # Enable DLA (Deep Learning Accelerator) cores on Jetson Orin
    config.default_device_type = trt.DeviceType.DLA
    config.DLA_core = 0
    
    with open(onnx_file_path, 'rb') as f:
        parser = trt.OnnxParser(builder.create_network(), logger)
        parser.parse(f.read())
        
    engine = builder.build_serialized_network(network, config)
    with open(engine_file_path, 'wb') as f:
        f.write(engine)
\`\`\`
`
  },
  {
    id: "blog-20",
    slug: "amr-fleet-navigation-nav2-slam-lidar",
    title: "Autonomous Mobile Robots (AMRs) in Logistics: Multi-Robot Fleet Navigation with Nav2, FAST-LIO & 3D LiDAR SLAM",
    subtitle: "Production warehouse automation: lifecycle nodes in Nav2, point cloud filtering, 3D LiDAR odometry using FAST-LIO2, and dynamic obstacle negotiation.",
    category: "Autonomous Navigation",
    publishDate: "August 25, 2026",
    readTime: "10 min read",
    author: AUTHORS.SRI_KANISH,
    tags: ["AMRs", "Nav2", "3D LiDAR", "SLAM", "FAST-LIO", "Warehouse Automation"],
    featured: false,
    summary: "Mastering warehouse AMR fleets: configuring 3D LiDAR SLAM with FAST-LIO2 and deploying ROS 2 Nav2 lifecycle nodes for industrial logistics.",
    content: `
# Autonomous Mobile Robots (AMRs) in Logistics: Nav2 & 3D LiDAR SLAM

E-commerce fulfillment centers require fleets of dozens of AMRs moving pallets at 2.5 m/s without stopping or colliding. Traditional 2D planar LiDAR struggles in dynamic warehouses where pallet heights change continuously. Modern AMRs use **solid-state 3D LiDAR + FAST-LIO2 SLAM**.

---

## 1. FAST-LIO2: Fast LiDAR-Inertial Odometry

FAST-LIO2 direct odometry computes sub-centimeter poses by fusing high-rate IMU measurements (200 Hz) with raw 3D point cloud points (10 Hz) using an iterated extended Kalman filter (iEKF):

\`\`\`
[ 3D LiDAR (Livox / Ouster) ] ──Raw Points──┐
                                            ├──> [ iEKF State Estimator (FAST-LIO2) ] ──> 6-DoF Odometry
[ High-Precision IMU (6-axis) ] ──Delta-V───┘
\`\`\`

Unlike classic ICP (Iterative Closest Point), FAST-LIO2 maintains an incremental kd-tree (\`ikd-Tree\`), updating point environments in under **12 milliseconds**.

---

## 2. Nav2 Lifecycle Architecture

In production environments, navigation nodes must be deterministically controlled. ROS 2 Nav2 uses managed lifecycle states:

- **Unconfigured $\\rightarrow$ Inactive $\\rightarrow$ Active $\\rightarrow$ Finalized**

If an AMR's emergency bumper triggers, the global planner and controller nodes transition from \`Active\` to \`Inactive\` within 2 milliseconds, cutting motor power safely.
`
  },
  {
    id: "blog-21",
    slug: "diffusion-policies-robotic-manipulation-dexterous",
    title: "Diffusion Policies for Robotic Manipulation: From Multimodal Imitation Learning to Dexterous Multi-Finger Grasping",
    subtitle: "Why diffusion-based policy networks outperform behavioral cloning in multi-finger dexterous hands, handling multimodal action distributions and teleoperation dataset synthesis.",
    category: "Robotic Manipulation",
    publishDate: "August 20, 2026",
    readTime: "11 min read",
    author: AUTHORS.MANOSAKTHI,
    tags: ["Diffusion Policy", "Dexterous Grasping", "Imitation Learning", "Robotic Arms", "Manipulation"],
    featured: true,
    summary: "Discover how diffusion policy models overcome the averaging trap in robotic imitation learning, enabling multi-fingered hands to manipulate delicate tools.",
    content: `
# Diffusion Policies in Robotic Manipulation

When training robotic arms using classical Behavioral Cloning (BC) with mean-squared error (MSE), the model averages multiple valid demonstrations. If human teleoperators demonstrated grasping a mug by either the handle or the rim, an MSE model predicts grasping thin air in the middle!

**Diffusion Policies** solve this by modeling the entire multimodal probability distribution of actions.

---

## 1. The Mathematical Principle of Action Diffusion

Instead of generating a deterministic action $\\mathbf{a} = f(\\mathbf{s})$, the policy iteratively denoises a random Gaussian action vector:

$$\\mathbf{a}^K \\sim \\mathcal{N}(0, \\mathbf{I})$$

$$\\mathbf{a}^{k-1} = \\alpha_k \\left( \\mathbf{a}^k - \\frac{\\beta_k}{\\sqrt{1 - \\bar{\\alpha}_k}} \\boldsymbol{\\epsilon}_\\theta(\\mathbf{a}^k, \\mathbf{s}, k) \\right) + \\sigma_k \\mathbf{z}$$

Denoising over $K = 16$ to $32$ steps produces sharp, multimodal action choices without averaging artifacts.

---

## 2. Dexterous Multi-Finger Hand Coordination

In hands with 16 to 24 actuated joints (e.g., Shadow Hand, Wonik Allegro), contact forces must be distributed across all fingertips. Diffusion policies predict joint trajectories that adapt naturally to soft and rigid objects alike.
`
  },
  {
    id: "blog-22",
    slug: "sim-to-real-transfer-isaac-sim-mujoco",
    title: "Sim-to-Real Transfer in Robotics: Domain Randomization, GPU Physics, and Bridging the Reality Gap with Isaac Sim & MuJoCo",
    subtitle: "Overcoming simulation artifacts: massively parallel reinforcement learning in NVIDIA Isaac Lab, contact physics modeling in MuJoCo Menagerie, and domain randomization strategies.",
    category: "Simulation & Sim-to-Real",
    publishDate: "August 15, 2026",
    readTime: "10 min read",
    author: AUTHORS.SRI_KANISH,
    tags: ["Sim-to-Real", "Isaac Sim", "MuJoCo", "Domain Randomization", "Physics Engines"],
    featured: false,
    summary: "A practical guide to overcoming the sim-to-real gap using GPU-accelerated environments in Isaac Sim and MuJoCo with systematic domain randomization.",
    content: `
# Sim-to-Real Transfer: Bridging Simulation and Physical Reality

Training reinforcement learning policies on physical robots causes gear wear, motor overheating, and room destruction. Simulators allow collecting **10,000 hours of robot experience in 20 minutes** on GPU clusters.

However, policies that achieve 100% success in simulation frequently fail on real hardware. This is the **Sim-to-Real Gap**.

---

## 1. The Causes of the Reality Gap

1. **Friction & Contact Non-Linearities:** Real rubber treads on concrete do not follow Coulomb friction models.
2. **Motor Backlash & Latency:** Real servo actuators suffer from deadbands and command delay (20ms – 50ms).
3. **Sensor Noise:** IMU drift, camera exposure variations, and lens distortions.

---

## 2. Systematic Domain Randomization (DR)

During training across 4,096 parallel environments in NVIDIA Isaac Lab, we systematically randomize every physical parameter at each reset:

$$\\mu_{\\text{friction}} \\sim \\mathcal{U}(0.2, 1.2)$$

$$m_{\\text{link}} \\sim m_{\\text{nominal}} \\times \\mathcal{U}(0.85, 1.15)$$

$$\\tau_{\\text{delay}} \\sim \\mathcal{U}(0, 30\\text{ ms})$$

By training the policy to succeed across all variations, the physical world simply appears as another randomized instance of the simulator!
`
  },
  {
    id: "blog-23",
    slug: "sovereign-edge-ai-robotics-trail-jung",
    title: "Sovereign Edge AI & Zero-Telemetry Robotics: Running Local-First Swarms with @junglans/trail and jung",
    subtitle: "Securing industrial robotics fleets and air-gapped automated inspection cells using local event logging in @junglans/trail and autonomous task state machines in Python jung.",
    category: "Edge AI & Security",
    publishDate: "August 10, 2026",
    readTime: "9 min read",
    author: AUTHORS.MANOSAKTHI,
    tags: ["Sovereign AI", "Zero Telemetry", "@junglans/trail", "jung", "Robotics Swarms"],
    featured: false,
    summary: "How defense and semiconductor manufacturing facilities secure robotic automation using local SQLite WAL event streams and zero-cloud telemetry frameworks.",
    content: `
# Sovereign Edge AI & Zero-Telemetry Robotics

In critical environments such as semiconductor cleanrooms, nuclear facilities, and defense fabrication cells, connecting robots to public cloud APIs violates basic security protocols.

At Junglans Solutions, we architect **Sovereign Local-First Robotics** using our open-source ecosystem: \`@junglans/trail\` and \`jung\`.

---

## 1. Local-First Event Journaling with @junglans/trail

Every robot sensor reading, joint fault, and safety stop is recorded directly into a local SQLite Write-Ahead Log (WAL) at microsecond speeds.

\`\`\`javascript
import { createTrailStore } from '@junglans/trail';

const robotLog = createTrailStore({
  storage: 'sqlite-wal',
  databasePath: '/opt/robotics/secure-journal.db',
  encryption: 'AES-256-GCM'
});

// Record millisecond joint state event with zero cloud telemetry
await robotLog.append('robot.arm.joint_state', {
  robot_id: 'AMR-04',
  torques: [12.4, 8.2, 4.1, 1.8, 0.9, 0.3],
  temperature_celsius: 42.1,
  emergency_stop_tripped: false
});
\`\`\`

---

## 2. Autonomous Task Orchestration with Python 'jung'

The \`jung\` framework runs directly on the robot's onboard industrial PC, managing mission state machines without external internet access:

\`\`\`python
from jung import AgentSwarm, TaskNode

swarm = AgentSwarm(local_only=True)

@swarm.register_tool
def inspect_weld_seam(camera_frame):
    # Local ONNX inference on onboard GPU
    return detect_weld_porosity(camera_frame)
\`\`\`
`
  },
  {
    id: "blog-24",
    slug: "neuromorphic-computing-event-cameras-robotics",
    title: "Neuromorphic Computing & Event-Based Vision: Microsecond Object Tracking for High-Speed Drones and Agile Robots",
    subtitle: "Dynamic Vision Sensors (DVS) with Prophesee sensors, Spiking Neural Networks (SNNs), and sub-millisecond obstacle dodging with ultra-low thermal dissipation.",
    category: "Neuromorphic Robotics",
    publishDate: "August 05, 2026",
    readTime: "10 min read",
    author: AUTHORS.SRI_KANISH,
    tags: ["Neuromorphic Vision", "Event Cameras", "DVS", "Spiking Neural Networks", "Drones"],
    featured: false,
    summary: "Discover how bio-inspired event cameras and Spiking Neural Networks give autonomous drones microsecond reaction speeds with 1/100th the power of frame-based cameras.",
    content: `
# Neuromorphic Computing & Event Cameras in Agile Robotics

Standard cameras capture frames at 30 or 60 Hz. When an autonomous drone flies through dense forest branches at 20 m/s (72 km/h), the drone travels over **33 centimeters between frames** — more than enough to cause a fatal crash!

**Neuromorphic Event Cameras** (such as Prophesee and iniVation DVS sensors) discard the concept of frames entirely.

---

## 1. How Event Cameras Work

Each pixel functions asynchronously and independently, emitting an event tuple $(x, y, t, p)$ only when its log-intensity changes:

$$|\\ln I(x, y, t) - \\ln I(x, y, t - \\Delta t)| > C$$

Where $C$ is a contrast threshold, $t$ is timestamped with **1 microsecond precision**, and $p \\in \\{-1, +1\\}$ is the polarity.

\`\`\`
Frame-Based: [ Empty Frame ] ── 33ms ──> [ Blurry Frame ] ── 33ms ──> [ Crash ]
Event-Based: [ Continuous stream of microsecond asynchronous spikes ] ──> Immediate reflex
\`\`\`

---

## 2. Spiking Neural Networks (SNNs)

Event streams are processed natively by Spiking Neural Networks using Leaky Integrate-and-Fire (LIF) neuron models, running on neuromorphic chips (like Intel Loihi 2 or SynSense Speck) consuming **less than 50 milliwatts**.
`
  },
  {
    id: "blog-25",
    slug: "compound-ai-systems-mcp-protocol-autonomous-agents",
    title: "The 2025–2026 AI Agent Revolution: Compound AI Systems, Anthropic's Model Context Protocol (MCP) & Deterministic Tool Orchestration",
    subtitle: "Why monolithic LLMs are being replaced by compound AI architectures: standardized tool integration via MCP, self-healing state graphs, and structured JSON schemas.",
    category: "AI Architecture & Agents",
    publishDate: "August 01, 2026",
    readTime: "12 min read",
    author: AUTHORS.MANOSAKTHI,
    tags: ["Compound AI", "Model Context Protocol", "MCP", "Autonomous Agents", "Tool Calling"],
    featured: true,
    summary: "Examine the shift toward Compound AI Systems and Anthropic's Model Context Protocol (MCP) for deterministic enterprise agent automation.",
    content: `
# The Compound AI Revolution: Beyond Monolithic Language Models

In early 2024, enterprise teams attempted to solve complex problems by asking single LLMs to generate entire programs in one shot. By 2025 and 2026, the industry consensus shifted definitively toward **Compound AI Systems**.

As Berkeley AI Research (BAIR) notes, state-of-the-art performance is driven by the system architecture around the model, not just model parameter scale.

---

## 1. What is Anthropic's Model Context Protocol (MCP)?

Historically, every AI framework implemented custom tool-calling mechanisms. **MCP (Model Context Protocol)** provides an open, universal standard for exposing data sources, tools, and prompts to AI agents over JSON-RPC:

\`\`\`
[ AI Agent / Orchestrator ]
           │ (MCP Client Protocol)
           ├──> [ PostgreSQL MCP Server ]
           ├──> [ Git Repository MCP Server ]
           └──> [ Local Terminal MCP Server ]
\`\`\`

### Sample MCP Tool Definition:
\`\`\`json
{
  "name": "query_database",
  "description": "Execute read-only SQL query on production replica",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": { "type": "string" }
    },
    "required": ["query"]
  }
}
\`\`\`

---

## 2. Deterministic State Graphs & Self-Healing Workflows

To prevent infinite loops and runaway agent hallucinations, production systems combine:
1. **Pydantic / Zod Structured Output Validation:** Every tool output must strictly conform to a typed schema.
2. **Deterministic State Machine DAGs:** Agents can only transition between explicitly permitted states.
3. **Local Auditability:** Every decision step is logged through high-speed Write-Ahead Logs via \`@junglans/trail\`.
`
  }
];
