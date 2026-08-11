# Machine Learning Models — Foundations Reference

A structured tour of the major ML model families, what they do, how they work at a foundational level, their key hyperparameters, and when to use them.

```
ML Models
├── Linear Models          → Linear Regression, Logistic Regression, Regularized (Ridge/Lasso/ElasticNet)
├── Distance/Instance-Based → KNN
├── Probabilistic           → Naive Bayes
├── Tree-Based              → Decision Trees, Random Forest, Gradient Boosting (XGBoost/LightGBM/CatBoost)
├── Margin-Based             → SVM
├── Unsupervised — Clustering → K-Means, DBSCAN, Hierarchical
├── Unsupervised — Dim. Reduction → PCA, t-SNE, UMAP
├── Neural Networks          → MLP, CNN, RNN/LSTM, Transformer
├── Ensembles                → Bagging, Boosting, Stacking
└── Time Series               → ARIMA, Prophet
```

---

## 1. Linear Models

### 1.1 Linear Regression

**What it does:** Predicts a continuous value as a weighted sum of input features.

```
ŷ = w₁x₁ + w₂x₂ + ... + wₙxₙ + b
```

**How it learns:** Finds weights `w` that minimize MSE (see Document 1) between predictions and actual values — either via a closed-form solution (Normal Equation) or iteratively via gradient descent.

**Key hyperparameters:** None fundamentally required for plain OLS; if trained by gradient descent — learning rate, number of iterations.

**When to use:** Baseline model, interpretable relationships, when the true relationship is roughly linear. **Limitations:** Can't capture non-linear patterns; sensitive to outliers.

```python
from sklearn.linear_model import LinearRegression
model = LinearRegression().fit(X_train, y_train)
```

### 1.2 Logistic Regression

**What it does:** Despite the name, this is a **classification** model. It applies a sigmoid function to a linear combination of features to output a probability between 0 and 1.

```
P(y=1) = 1 / (1 + e^-(w·x + b))
```

**How it learns:** Minimizes log-loss (cross-entropy) via gradient descent.

**Key hyperparameters:** `C` (inverse regularization strength — lower C = stronger regularization), `penalty` (l1/l2/elasticnet), `max_iter`.

**When to use:** Baseline classifier, interpretable coefficients (odds ratios), when you need calibrated probabilities.

```python
from sklearn.linear_model import LogisticRegression
model = LogisticRegression(C=1.0, penalty='l2').fit(X_train, y_train)
```

### 1.3 Regularized Linear Models

Regularization adds a penalty term to discourage overly large weights, reducing overfitting.

- **Ridge (L2):** `Loss = MSE + α × Σw²` — shrinks all weights toward zero smoothly, keeps all features.
- **Lasso (L1):** `Loss = MSE + α × Σ|w|` — can shrink some weights to *exactly* zero, effectively performing feature selection.
- **ElasticNet:** Combines both — `Loss = MSE + α × (ρ×Σ|w| + (1−ρ)/2 × Σw²)`.

**Key hyperparameter:** `α` (regularization strength — higher = simpler model, more bias, less variance).

---

## 2. Distance-Based: K-Nearest Neighbors (KNN)

**What it does:** For a new point, find the K closest points in the training data (by some distance metric, usually Euclidean) and predict the majority class (classification) or average value (regression) among them.

**How it "learns":** It doesn't — KNN is a **lazy learner**; it just memorizes the training set and does all the work at prediction time.

**Key hyperparameters:**
- `k` — number of neighbors (small k → low bias/high variance, noisy; large k → smoother, more biased)
- `distance metric` — Euclidean, Manhattan, Minkowski, cosine
- `weights` — uniform vs. distance-weighted voting

**When to use:** Small-to-medium datasets, non-linear decision boundaries, when interpretability of "similar past examples" is valuable. **Limitations:** Slow at prediction time on large data, sensitive to feature scaling (always standardize features first) and the curse of dimensionality.

```python
from sklearn.neighbors import KNeighborsClassifier
model = KNeighborsClassifier(n_neighbors=5).fit(X_train, y_train)
```

---

## 3. Probabilistic: Naive Bayes

**What it does:** Applies Bayes' Theorem, assuming features are conditionally independent given the class (the "naive" assumption — usually false in reality, but works surprisingly well in practice).

```
P(class | features) ∝ P(class) × Π P(feature_i | class)
```

**Variants:**
- **GaussianNB** — assumes continuous features are normally distributed per class
- **MultinomialNB** — for count data (e.g., word counts in text classification)
- **BernoulliNB** — for binary/boolean features

**When to use:** Text classification (spam filtering, sentiment), extremely fast to train, works well with high-dimensional sparse data, good baseline. **Limitations:** The independence assumption limits accuracy ceiling on correlated features.

```python
from sklearn.naive_bayes import MultinomialNB
model = MultinomialNB().fit(X_train, y_train)
```

---

## 4. Tree-Based Models

### 4.1 Decision Trees

**What it does:** Recursively splits data on feature thresholds to create a tree of if/else rules ending in leaf predictions.

**How it learns:** At each node, picks the split that most reduces **impurity**:
- **Gini Impurity** (classification): `Gini = 1 − Σ p_i²`
- **Entropy** (classification): `Entropy = −Σ p_i log₂(p_i)`
- **Variance reduction** (regression)

**Key hyperparameters:** `max_depth`, `min_samples_split`, `min_samples_leaf`, `max_features` — all control overfitting (unpruned trees memorize training data perfectly).

**When to use:** Interpretability (can visualize the exact decision rules), no need to scale features, handles non-linear relationships and feature interactions naturally. **Limitations:** High variance — small data changes can produce very different trees; prone to overfitting alone (hence ensembles below).

```python
from sklearn.tree import DecisionTreeClassifier
model = DecisionTreeClassifier(max_depth=5).fit(X_train, y_train)
```

### 4.2 Random Forest

**What it does:** Trains many decision trees on **bootstrapped** (random sampled-with-replacement) subsets of data, each also using a random subset of features at each split, then averages/votes their predictions. This is **bagging** (bootstrap aggregating) applied to trees.

**Why it works:** Individual trees overfit differently; averaging many uncorrelated trees cancels out their individual errors, reducing variance while keeping low bias.

**Key hyperparameters:** `n_estimators` (number of trees), `max_depth`, `max_features` (features considered per split — key source of tree diversity), `min_samples_leaf`.

**When to use:** Strong general-purpose default for tabular data, robust to overfitting compared to single trees, gives feature importance scores.

```python
from sklearn.ensemble import RandomForestClassifier
model = RandomForestClassifier(n_estimators=200, max_depth=10).fit(X_train, y_train)
```

### 4.3 Gradient Boosting (XGBoost / LightGBM / CatBoost)

**What it does:** Builds trees **sequentially**, where each new tree is trained to correct the errors (residuals) of the ensemble so far, rather than training trees independently like Random Forest.

**Core idea:**
```
F_m(x) = F_{m-1}(x) + η × h_m(x)
```
where `h_m` is a new tree fit to the negative gradient of the loss function w.r.t. the current predictions, and `η` (eta) is the learning rate controlling how much each new tree contributes.

**Key hyperparameters:**
- `n_estimators` — number of boosting rounds
- `learning_rate` (`eta`) — shrinks each tree's contribution; lower values need more trees but generalize better
- `max_depth` — usually shallow trees (3–8) since boosting builds strength through many weak learners, not deep individual trees
- `subsample` — fraction of rows used per tree (adds randomness, reduces overfitting)
- `colsample_bytree` — fraction of features used per tree
- `reg_lambda`/`reg_alpha` — L2/L1 regularization on leaf weights

**Library differences (high level):**
- **XGBoost** — the original, highly optimized, widely used, strong regularization support.
- **LightGBM** — leaf-wise tree growth (vs. level-wise) → faster on large data, uses histogram binning.
- **CatBoost** — built-in handling of categorical features without manual encoding, uses ordered boosting to reduce a subtle form of leakage called "prediction shift."

**When to use:** The dominant approach for structured/tabular data competitions and production systems — usually outperforms Random Forest given enough tuning. **Limitations:** More hyperparameters to tune, more prone to overfitting if learning rate/depth aren't controlled, sequential training is slower than parallel bagging.

```python
import xgboost as xgb
model = xgb.XGBClassifier(n_estimators=300, learning_rate=0.05, max_depth=4).fit(X_train, y_train)
```

---

## 5. Margin-Based: Support Vector Machines (SVM)

**What it does:** Finds the hyperplane that separates classes with the **maximum margin** (largest distance to the nearest points of each class, called support vectors).

**The kernel trick:** For non-linearly separable data, SVM implicitly maps features into a higher-dimensional space where a linear separator *does* exist, without ever explicitly computing that mapping — done via a kernel function.

**Common kernels:**
- `linear` — for linearly separable data
- `rbf` (Radial Basis Function/Gaussian) — most common default, handles complex non-linear boundaries
- `poly` — polynomial decision boundaries

**Key hyperparameters:**
- `C` — regularization; low C = wider margin, tolerates more misclassification (simpler boundary); high C = tries to classify all training points correctly (can overfit)
- `gamma` (for rbf/poly) — how far the influence of a single training point reaches; high gamma = tight, wiggly boundary (can overfit)

**When to use:** High-dimensional data (text classification, bioinformatics), small-to-medium datasets, clear margin of separation. **Limitations:** Doesn't scale well to very large datasets, less interpretable than trees, requires feature scaling.

```python
from sklearn.svm import SVC
model = SVC(kernel='rbf', C=1.0, gamma='scale').fit(X_train, y_train)
```

---

## 6. Unsupervised — Clustering

### 6.1 K-Means

**What it does:** Partitions data into K clusters by iteratively: (1) assigning each point to its nearest centroid, (2) recomputing centroids as the mean of assigned points, repeating until convergence.

**Key hyperparameters:** `k` (number of clusters — chosen via the **elbow method** on within-cluster sum of squares, or **silhouette score**), `init` (initialization strategy, e.g. `k-means++` for smarter starting centroids), `n_init` (number of random restarts, since K-Means can converge to local optima).

**When to use:** Roughly spherical, similarly-sized clusters; fast and scalable. **Limitations:** Must pre-specify k, sensitive to outliers and initialization, struggles with non-convex cluster shapes.

```python
from sklearn.cluster import KMeans
model = KMeans(n_clusters=4, n_init=10).fit(X)
```

### 6.2 DBSCAN

**What it does:** Density-Based Spatial Clustering — groups points that are closely packed together, marking points in low-density regions as **outliers/noise**, without requiring a predefined number of clusters.

**Key hyperparameters:** `eps` (neighborhood radius), `min_samples` (minimum points to form a dense region/core point).

**When to use:** Clusters of arbitrary shape, data with noise/outliers you want automatically flagged, unknown number of clusters. **Limitations:** Struggles with clusters of very different densities; sensitive to `eps` choice.

```python
from sklearn.cluster import DBSCAN
model = DBSCAN(eps=0.5, min_samples=5).fit(X)
```

### 6.3 Hierarchical Clustering

**What it does:** Builds a tree of clusters (**dendrogram**) either bottom-up (agglomerative — start with each point as its own cluster, repeatedly merge the closest pair) or top-down (divisive).

**Key hyperparameters:** `linkage` method — how "distance between clusters" is defined:
- `single` — minimum distance between any two points across clusters
- `complete` — maximum distance
- `average` — average distance
- `ward` — minimizes increase in total within-cluster variance (most common default)

**When to use:** When you want to explore clustering at multiple granularities (cut the dendrogram at different heights), don't want to pre-specify k, need a visual/interpretable cluster hierarchy.

```python
from sklearn.cluster import AgglomerativeClustering
model = AgglomerativeClustering(n_clusters=4, linkage='ward').fit(X)
```

---

## 7. Unsupervised — Dimensionality Reduction

### 7.1 PCA (Principal Component Analysis)

**What it does:** Finds new axes (principal components) that are linear combinations of the original features, ordered by how much variance they capture, and projects data onto the top few — reducing dimensions while preserving as much information (variance) as possible.

**How it works (foundation):** Computes the covariance matrix of the (centered) data, then finds its eigenvectors (directions of maximum variance) and eigenvalues (amount of variance along each direction) via eigendecomposition or SVD.

**Key hyperparameters:** `n_components` (target dimensionality, or a variance-explained threshold like 0.95).

**When to use:** Reducing feature count before modeling, visualization (project to 2D/3D), removing multicollinearity, compression. **Limitations:** Only captures *linear* structure; components lose direct interpretability (they're combinations of original features).

```python
from sklearn.decomposition import PCA
pca = PCA(n_components=0.95)  # keep 95% of variance
X_reduced = pca.fit_transform(X)
```

### 7.2 t-SNE

**What it does:** Non-linear dimensionality reduction, mainly for **visualization** (typically to 2D/3D). Models pairwise similarities between points in high-dimensional space and finds a low-dimensional layout that preserves those similarities — especially good at preserving local neighborhood structure (clusters stay visually distinct).

**Key hyperparameters:** `perplexity` (balances local vs. global structure attention, roughly "how many neighbors matter" — typical range 5–50), `learning_rate`, `n_iter`.

**When to use:** Visually exploring high-dimensional data (e.g., embeddings) to spot clusters. **Limitations:** Slow on large datasets, non-deterministic (different runs give different layouts), distances *between* clusters in the output aren't meaningful — only within-cluster tightness is; not meant for downstream modeling, only visualization.

```python
from sklearn.manifold import TSNE
X_2d = TSNE(n_components=2, perplexity=30).fit_transform(X)
```

### 7.3 UMAP

**What it does:** Similar goal to t-SNE (non-linear embedding for visualization or as a preprocessing step) but based on manifold learning and topological data analysis. Generally faster than t-SNE and better preserves some global structure alongside local structure.

**Key hyperparameters:** `n_neighbors` (local vs. global structure trade-off, analogous to perplexity), `min_dist` (how tightly points are allowed to pack in the low-dim embedding).

**When to use:** Similar use cases to t-SNE but with better speed at scale, and — unlike t-SNE — can be used to transform *new* unseen data after fitting, making it usable as a preprocessing step in a pipeline, not just for one-off visualization.

```python
import umap
reducer = umap.UMAP(n_neighbors=15, min_dist=0.1)
X_embedded = reducer.fit_transform(X)
```

---

## 8. Neural Networks

### 8.1 MLP (Multi-Layer Perceptron)

**What it does:** The foundational feedforward neural network — layers of neurons, each computing a weighted sum of inputs followed by a non-linear **activation function**, stacked so the network can approximate complex non-linear functions (Universal Approximation Theorem).

```
layer output = activation(W · x + b)
```

**Key components:**
- **Activation functions** — ReLU (`max(0,x)`, most common in hidden layers), Sigmoid (0–1 output, used for binary outputs), Softmax (for multi-class output probabilities), Tanh, GELU.
- **Loss function** — cross-entropy for classification, MSE for regression.
- **Backpropagation** — computes gradients of the loss w.r.t. every weight via the chain rule, propagating error backward through the network.
- **Optimizer** — updates weights using those gradients (SGD, Adam, etc. — see Document 4 for depth).

**Key hyperparameters:** number of layers/neurons per layer, activation function, learning rate, batch size, epochs, dropout rate (regularization that randomly zeroes neurons during training).

**When to use:** Tabular data where feature interactions are complex and non-linear, as a component within larger architectures. **Limitations:** No built-in structure for spatial data (images) or sequential data (text/time series) — that's what CNNs and RNNs/Transformers add.

### 8.2 CNN (Convolutional Neural Network)

**What it does:** Applies learnable filters (**kernels**) that slide across input data (typically images) to detect local spatial patterns (edges, textures, shapes), building up from simple to complex features across layers.

**Key components:**
- **Convolution layer** — slides a small filter (e.g., 3×3) across the image, computing dot products, producing a "feature map." Filters are learned, not hand-designed.
- **Pooling layer** — downsamples feature maps (e.g., MaxPooling takes the max value in each region), reducing dimensionality and adding translation invariance.
- **Stride** — how far the filter moves each step. **Padding** — adding border pixels so output size can be controlled (e.g., "same" padding preserves input size).

**Key hyperparameters:** number of filters per layer, kernel size, stride, padding, number of conv/pool layers, pooling type.

**When to use:** Image classification, object detection, segmentation — anywhere spatial locality matters. Also used on 1D sequences (e.g., audio, some text tasks).

### 8.3 RNN / LSTM

**What it does:** Processes sequential data one step at a time, maintaining a **hidden state** that carries information from previous steps forward — giving the network "memory" of what came before.

**The vanishing gradient problem:** Plain RNNs struggle to learn long-range dependencies because gradients shrink exponentially as they're backpropagated through many time steps.

**LSTM (Long Short-Term Memory)** fixes this with a more complex cell containing three **gates**:
- **Forget gate** — decides what to discard from the cell state
- **Input gate** — decides what new information to add
- **Output gate** — decides what to output based on the cell state

This gating mechanism lets gradients flow more directly across many time steps, enabling learning of longer-range dependencies. **GRU (Gated Recurrent Unit)** is a simpler, faster variant with two gates instead of three.

**Key hyperparameters:** hidden state size, number of stacked layers, sequence length, dropout.

**When to use:** Historically used for time series, text, and speech before Transformers took over most of NLP; still relevant for streaming/online sequential data and smaller-scale sequence tasks. **Limitations:** Sequential-by-nature processing means slow training (can't parallelize across time steps like Transformers can).

### 8.4 Transformer

**What it does:** Processes an entire sequence at once (not step-by-step like RNNs) using **self-attention** to let every token directly look at every other token, weighted by relevance — this is the architecture behind virtually all modern LLMs. Covered in depth in Document 4.

**Core idea (brief here, expanded in Doc 4):**
```
Attention(Q, K, V) = softmax(QKᵀ / √d_k) × V
```
Each token generates a Query, Key, and Value vector; attention scores (how much each token should "attend to" every other token) come from comparing Queries against Keys, then used to weight the Values.

**Why it replaced RNNs for most NLP work:** Fully parallelizable across the sequence (much faster to train on GPUs), and self-attention captures long-range dependencies directly without the information having to pass sequentially through every intermediate step.

---

## 9. Ensemble Methods (Meta-Techniques)

Ensembles combine multiple models to get better performance than any single model. Three main strategies:

### 9.1 Bagging (Bootstrap Aggregating)

Train multiple instances of the **same** model type on different random subsets (with replacement) of the training data, then average/vote their predictions. Reduces **variance**. Random Forest is the canonical example.

### 9.2 Boosting

Train models **sequentially**, each one focusing on correcting the errors of the previous ones (by re-weighting misclassified examples, or by fitting residuals). Reduces **bias** (and can reduce variance too, with proper regularization). Gradient Boosting, AdaBoost, XGBoost are examples.

### 9.3 Stacking

Train several **different** model types (e.g., a Random Forest, an SVM, and a Logistic Regression) on the same data, then train a "meta-model" that takes their predictions as input and learns how to best combine them. Can capture complementary strengths of very different model types.

| Strategy | Combines | Primarily reduces | Trains |
|---|---|---|---|
| Bagging | Same model, different data samples | Variance | In parallel |
| Boosting | Same model type, sequentially corrected | Bias | Sequentially |
| Stacking | Different model types | Both (via learned combination) | Base models in parallel, meta-model after |

---

## 10. Time Series Models

### 10.1 ARIMA (AutoRegressive Integrated Moving Average)

**What it does:** Classical statistical model for forecasting, combining three components, notated `ARIMA(p, d, q)`:
- **AR(p)** — AutoRegressive: predicts the current value as a weighted sum of the previous `p` values.
- **I(d)** — Integrated: applies differencing `d` times (subtracting the previous value from the current one) to make a non-stationary series stationary (constant mean/variance over time — a requirement for the model).
- **MA(q)** — Moving Average: models the current value as a function of past `q` forecast errors.

```
Y_t = c + Σ φᵢ Y_{t-i} + Σ θᵢ ε_{t-i} + ε_t
```

**Key hyperparameters:** `p`, `d`, `q` — typically chosen via ACF/PACF plots (autocorrelation analysis) or automated search (`auto_arima`). Seasonal variant **SARIMA** adds seasonal (P, D, Q, s) terms for periodic patterns.

**When to use:** Univariate time series with clear trend/seasonality and enough historical data, when interpretability of the statistical model matters. **Limitations:** Assumes linear relationships, requires manual stationarity handling, doesn't natively handle multiple seasonalities or external regressors well (though `SARIMAX` adds exogenous variables).

```python
from statsmodels.tsa.arima.model import ARIMA
model = ARIMA(series, order=(2,1,2)).fit()
forecast = model.forecast(steps=10)
```

### 10.2 Prophet

**What it does:** Developed by Meta for business forecasting. Decomposes a time series into additive (or multiplicative) components:

```
y(t) = trend(t) + seasonality(t) + holidays(t) + ε
```

- **Trend** — piecewise linear or logistic growth curve, with automatic detection of "changepoints" where the trend shifts.
- **Seasonality** — modeled via Fourier series to flexibly capture daily/weekly/yearly patterns.
- **Holidays** — user-specified list of irregular events with their own effect.

**Key hyperparameters:** `changepoint_prior_scale` (flexibility of the trend — higher = more prone to overfitting to trend shifts), seasonality mode (additive vs. multiplicative), custom seasonalities, holiday lists.

**When to use:** Business time series with strong seasonality, missing data, and outliers (Prophet is fairly robust to these), when you want a fast, largely-automatic forecast without deep statistical tuning. **Limitations:** Less flexible than modern deep learning approaches for complex multivariate dependencies; primarily designed for daily/sub-daily business data with human-interpretable seasonal patterns.

```python
from prophet import Prophet
model = Prophet(yearly_seasonality=True, changepoint_prior_scale=0.05)
model.fit(df)  # df needs columns 'ds' (date) and 'y' (value)
forecast = model.predict(future_df)
```

---

## 11. Model Selection Cheat Sheet

| Situation | Reach for |
|---|---|
| Tabular data, need interpretability | Linear/Logistic Regression, single Decision Tree |
| Tabular data, want best accuracy | Gradient Boosting (XGBoost/LightGBM/CatBoost), Random Forest |
| Small dataset, high dimensions | SVM, Naive Bayes (text), Regularized linear models |
| Images | CNN (or fine-tuned Vision Transformer) |
| Sequential/text data (modern) | Transformer |
| Sequential data, streaming/small-scale | LSTM/GRU |
| Unlabeled data, find groups | K-Means (known k, spherical), DBSCAN (unknown k, arbitrary shape) |
| Too many features | PCA (for modeling), t-SNE/UMAP (for visualization) |
| Forecasting with seasonality | Prophet (business-friendly), SARIMA (statistical rigor) |
