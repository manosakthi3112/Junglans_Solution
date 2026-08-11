# RAG (Retrieval-Augmented Generation) — Foundations to Advanced

## 1. Why RAG Exists

An LLM's knowledge is frozen at training time and limited to what fit in its training data — it can't know about your private documents, today's news, or anything that happened after its cutoff. It also **hallucinates** (Document 2 §2.5) when asked about things it doesn't actually know.

**RAG's core idea:** Instead of relying purely on what the model memorized during training, *retrieve* relevant information from an external knowledge source at query time, and give it to the model as context to generate its answer from.

```
User Query → Retriever finds relevant chunks → Chunks + Query → LLM → Grounded Answer
```

This turns the LLM from "a closed-book exam taker" into "an open-book exam taker" — it can look things up instead of guessing from memory.

---

## 2. The Full RAG Pipeline — End to End

### Phase A: Indexing (done once, ahead of time, then updated as data changes)

```
Raw Documents → Parsing → Chunking → Embedding → Store in Vector Database
```

### Phase B: Retrieval + Generation (done per query, at request time)

```
User Query → Embed Query → Search Vector DB → Retrieve Top-K Chunks →
    (Optional: Rerank) → Construct Prompt (query + chunks) → LLM Generates Answer
```

Each stage below is a real design decision with trade-offs — this is where most RAG system quality is won or lost, far more than the choice of LLM itself.

---

## 3. Document Parsing & Preprocessing

Before chunking, raw sources (PDFs, HTML, Word docs, databases, images with OCR) must be converted to clean text.

**Considerations:**
- Preserve structure where useful (headings, tables, lists) — flattening a table into plain text can destroy its meaning.
- Handle multi-column PDFs, footnotes, headers/footers correctly, or retrieval will return garbled fragments.
- Extract metadata (source, author, date, section) alongside the text — this becomes critical for filtering and citations later.

---

## 4. Chunking Strategies

**Why chunk at all:** Embedding models and LLM context windows have limits, and retrieving a whole 50-page document for every query is both computationally wasteful and dilutes relevance (the embedding of a huge document is a blurry average of everything in it).

### 4.1 Fixed-Size Chunking

Split text every N tokens/characters, often with **overlap** (e.g., 500-token chunks with 50-token overlap) so information near a chunk boundary isn't lost entirely from both neighboring chunks.

**Trade-off:** Simple and fast, but can cut sentences or ideas in half arbitrarily.

### 4.2 Recursive / Structure-Aware Chunking

Split along natural boundaries first (paragraphs → sentences → words), falling back to smaller units only if a chunk is still too large. Respects the document's actual structure much better than fixed-size splitting.

### 4.3 Semantic Chunking

Split based on meaning shifts — compute embeddings for consecutive sentences and start a new chunk when semantic similarity drops significantly (indicating a topic change), rather than at an arbitrary token count.

### 4.4 Document-Structure-Aware Chunking

Chunk along logical document units — one chunk per section/subsection/table, using headings or markdown structure as natural boundaries. Best when documents have clear hierarchical structure (technical docs, manuals).

### 4.5 Chunk Size Trade-off

| Chunk size | Pros | Cons |
|---|---|---|
| Small (e.g., 100–200 tokens) | Precise retrieval, less irrelevant content per chunk | Loses surrounding context, may need many chunks to answer |
| Large (e.g., 1000+ tokens) | More context preserved per chunk | Embedding "blurs" multiple ideas together, wastes context window with irrelevant text |

**Common mitigation — "small-to-big" retrieval:** Embed and search on small chunks (precise matching), but return the larger parent section/document they belong to for generation (full context). This gets precision at search time and completeness at generation time.

---

## 5. Embedding Models

**What an embedding is:** A dense numeric vector (e.g., 384, 768, or 1536+ dimensions) representing the semantic meaning of a piece of text, such that semantically similar texts have vectors that are close together (by cosine similarity or dot product).

**How they're trained (foundation):** Typically via **contrastive learning** — trained on pairs of texts known to be related (e.g., a question and its correct answer, or two paraphrases) so the model learns to pull related pairs' embeddings together and push unrelated pairs' embeddings apart in vector space.

**Choosing an embedding model:**
- **Dimensionality** — higher dimensions can capture more nuance but cost more storage/compute; many modern models offer good quality at 384–1024 dimensions.
- **Domain fit** — general-purpose (e.g., trained on broad web text) vs. domain-specific (legal, medical, code) — a mismatch here silently hurts retrieval quality.
- **Multilingual support** — critical if your documents/queries span multiple languages (relevant for mixed-language content, e.g., Tamil-English).
- **Max input length** — must be ≥ your chunk size, or the embedding model will silently truncate your chunk.
- **Symmetric vs. asymmetric** — some embedding models are optimized specifically for "short query vs. long passage" matching (asymmetric semantic search) rather than "similar-length text vs. similar-length text" (symmetric similarity) — using the wrong type measurably hurts retrieval quality.

---

## 6. Vector Databases

**What they do:** Store embeddings alongside their source text/metadata, and efficiently find the nearest vectors to a query vector — critical because brute-force comparing a query to millions of vectors one-by-one doesn't scale.

### 6.1 Approximate Nearest Neighbor (ANN) Search

Exact nearest-neighbor search is `O(n)` per query — too slow at scale. ANN algorithms trade a small amount of accuracy for massive speed gains:

- **HNSW (Hierarchical Navigable Small World)** — builds a multi-layer graph structure connecting similar vectors; search "hops" through the graph toward the nearest neighbors. The most common approach in modern vector DBs — very fast, high recall.
- **IVF (Inverted File Index)** — clusters vectors into buckets ("cells"); a query only searches the nearest few buckets instead of the whole dataset.
- **Product Quantization (PQ)** — compresses vectors into compact codes to reduce memory footprint, often combined with IVF (IVF-PQ).

### 6.2 Common Vector Database Options

- **Managed/dedicated:** Pinecone, Weaviate, Qdrant, Milvus
- **Add-on to existing DB:** pgvector (Postgres), Elasticsearch/OpenSearch (also supports hybrid search natively), Redis
- **Local/embedded:** FAISS (a library, not a full DB — great for prototyping/small-scale), Chroma, LanceDB

**Key factors when choosing:** scale (millions vs. billions of vectors), need for metadata filtering alongside vector search, hosting preference (managed vs. self-hosted), and whether you need hybrid (vector + keyword) search built in.

### 6.3 Metadata Filtering

Real systems almost always combine vector similarity with structured filters — e.g., "find similar chunks, but only from documents tagged `department: legal` and `date > 2024`." This requires the vector DB to support **pre-filtering** (filter before search) or efficient **post-filtering** (search then filter) without destroying recall.

---

## 7. Retrieval Methods

### 7.1 Dense Retrieval

Uses embeddings as described above — captures **semantic** similarity, finds relevant results even without exact keyword matches (e.g., a query for "car" can retrieve a passage about "automobile").

### 7.2 Sparse Retrieval

Traditional keyword-based methods:
- **TF-IDF** — weights terms by how frequent they are in a document vs. how rare they are across all documents (rare-but-present terms score highly).
- **BM25** — an improved, more robust version of TF-IDF that's still the industry-standard sparse baseline; accounts for document length and saturates term-frequency scoring (the 10th occurrence of a word matters much less than the 2nd).

**Strength dense retrieval lacks:** Exact matches on rare terms — product codes, names, specific numbers, acronyms — where semantic similarity can actually hurt (embeddings may not distinguish "invoice #4471" from "invoice #4472" well, but BM25 nails exact matches).

### 7.3 Hybrid Search

Combines dense + sparse retrieval, then merges/reranks the results — usually outperforms either alone, since they catch different kinds of relevant matches.

**Common merging approach — Reciprocal Rank Fusion (RRF):**
```
RRF_score(doc) = Σ 1 / (k + rank_in_list_i)
```
summed across each retrieval method's ranked list (k is a small constant, often 60), giving documents that rank well across *multiple* methods a higher combined score.

### 7.4 Query Transformation Techniques

The raw user query isn't always the best search query:
- **Query rewriting/expansion** — use an LLM to rephrase or add synonyms/related terms to the query before retrieval.
- **HyDE (Hypothetical Document Embeddings)** — have the LLM first generate a *hypothetical* answer to the query (even if it might be wrong), then embed and search using that hypothetical answer's embedding instead of the raw query — often matches real documents better since it's phrased more like an answer than a question.
- **Multi-query retrieval** — generate several reworded versions of the query, retrieve for each, and merge/deduplicate results — improves recall for ambiguous queries.
- **Query decomposition** — break a complex multi-part question into sub-questions, retrieve separately for each, then combine.

---

## 8. Reranking

**Why it's needed:** Initial retrieval (especially with fast ANN search) optimizes for speed over precision, often over-retrieving (e.g., top 50–100 candidates) with some irrelevant ones mixed in. Reranking applies a slower but more accurate model to re-score just that smaller candidate set.

**Cross-encoders vs. bi-encoders:**
- **Bi-encoder** (what the initial embedding-based retrieval uses) — embeds query and document *separately*, then compares vectors. Fast (can pre-compute document embeddings), but less accurate since query and document never directly interact.
- **Cross-encoder** (used for reranking) — feeds the query and document *together* into a model that directly scores their relevance jointly. Much more accurate (captures fine-grained interaction), but too slow to run against millions of documents — hence it's only applied to the smaller candidate set from initial retrieval.

**Typical pipeline:** Retrieve top 50–100 with fast dense/hybrid search → rerank with a cross-encoder → keep top 3–10 for the LLM.

---

## 9. Prompt Construction for Generation

Once the final chunks are selected, they need to be assembled into a prompt for the LLM:

```
System: You are a helpful assistant. Answer the question using ONLY the provided context.
If the answer isn't in the context, say you don't know.

Context:
[Chunk 1 — Source: policy.pdf, Section 3]
...chunk text...

[Chunk 2 — Source: faq.pdf, Section 1]
...chunk text...

Question: {user_query}

Answer:
```

**Best practices:**
- Include **source attribution** per chunk so the model can cite where information came from (and so you can display citations to the user).
- Explicitly instruct the model to only use the provided context (reduces hallucination — connects directly to the Groundedness metric from Document 2 §3.3).
- Order matters: some models attend more strongly to content at the start/end of a long context ("lost in the middle" effect) — placing the most relevant chunk first or last can help.
- Leave room in the context window for the answer itself, chat history, and system instructions — don't fill 100% of the window with retrieved chunks.

---

## 10. Advanced RAG Architectures

### 10.1 Graph-RAG

Instead of (or in addition to) a vector database of flat text chunks, builds a **knowledge graph** — entities (people, concepts, events) as nodes, relationships between them as edges — extracted from the source documents (often via an LLM performing entity/relationship extraction).

**Why it helps:** Plain vector RAG struggles with questions requiring **multi-hop reasoning** across pieces of information that are semantically distant from each other but logically connected (e.g., "What did the person who succeeded the founder of X do next?" requires chaining facts, not just finding one similar chunk). Graph traversal can follow these relationship chains explicitly.

**Typical approach:** Retrieve relevant graph neighborhoods (nodes + their connected edges) around entities mentioned in the query, alongside or instead of plain text chunks, then feed that structured context to the LLM. Often combined with **community detection/summarization** — clustering related nodes and pre-generating summaries of each cluster, useful for high-level "summarize this whole topic" queries that no single chunk (or even single graph neighborhood) could answer well.

### 10.2 Agentic RAG

Instead of one fixed retrieve-then-generate pass, the LLM acts as an **agent** that decides, iteratively:
- Whether it needs to retrieve at all for this query
- What to search for
- Whether the retrieved results are sufficient, or whether to reformulate the query and search again
- When to stop retrieving and generate the final answer

This handles complex, multi-step questions better than single-pass RAG, at the cost of more LLM calls (latency, cost) per query.

### 10.3 Self-RAG / Corrective RAG

The model is trained or prompted to critique its own retrieval and generation:
- Judge whether retrieved chunks are actually relevant before using them (discarding irrelevant ones).
- Judge whether its own draft answer is well-supported by the retrieved context before finalizing it.
- If retrieval quality is poor, trigger a fallback (re-search with a different query, or fall back to web search).

### 10.4 Multi-Vector / Parent-Document Retrieval

Store multiple representations per source unit — e.g., embed several small summary sentences or synthetic Q&A pairs generated *about* a chunk, search against those (which are cleaner/more targeted for matching queries), but retrieve and pass the original larger chunk/document to the LLM for generation. This is a more sophisticated version of the "small-to-big" idea from Section 4.5.

---

## 11. Evaluating a RAG System

Covered in depth in Document 2, Section 3 — summarized here for completeness:

| Metric | What it checks | Which half of the pipeline |
|---|---|---|
| Context Precision | Are retrieved chunks actually relevant? | Retrieval |
| Context Recall | Is all necessary information present in retrieval? | Retrieval |
| Groundedness/Faithfulness | Is the answer supported by retrieved context (not hallucinated)? | Generation |
| Answer Relevancy | Does the answer address the actual question? | Generation |

**Practical workflow:** Build a small evaluation set of (question, expected answer, expected source chunks) pairs — ideally covering easy, hard, and adversarial/out-of-scope questions — and run it through frameworks like **RAGAS** or **TruLens** whenever you change chunking, embedding model, retrieval method, or prompt, to catch regressions before shipping.

---

## 12. Common RAG Failure Modes & Fixes

| Failure | Likely cause | Fix to try |
|---|---|---|
| Answer is confidently wrong | Retrieved context wasn't actually relevant, model used prior knowledge instead | Improve retrieval (hybrid search, reranking); strengthen "answer only from context" instruction |
| Answer misses key info that *was* retrieved | Chunk too large/noisy, or info buried in "lost in the middle" region | Smaller/cleaner chunks; reorder context; parent-document retrieval |
| Retrieval returns irrelevant chunks | Embedding model/domain mismatch, chunk size too large (diluted meaning), or query phrased very differently from source text | Try domain-specific or better embedding model; smaller chunks; query rewriting/HyDE |
| Answer needs facts from multiple documents | Single-hop vector search can't chain relationships | Graph-RAG, multi-query retrieval, agentic multi-step retrieval |
| System is too slow | Too many retrieval + rerank + LLM round trips | Cache embeddings, reduce top-k before reranking, use a faster/smaller reranker, parallelize independent retrieval calls |

---

## 13. RAG — End-to-End Minimal Example (Conceptual)

```python
from sentence_transformers import SentenceTransformer
import numpy as np

# --- Indexing phase ---
embedder = SentenceTransformer('all-MiniLM-L6-v2')
chunks = ["...chunk 1 text...", "...chunk 2 text...", "...chunk 3 text..."]
chunk_embeddings = embedder.encode(chunks)  # shape: [n_chunks, dim]

# --- Retrieval phase ---
query = "What is the refund policy?"
query_embedding = embedder.encode([query])[0]

# cosine similarity search (in production, use a vector DB's ANN index instead)
similarities = chunk_embeddings @ query_embedding / (
    np.linalg.norm(chunk_embeddings, axis=1) * np.linalg.norm(query_embedding)
)
top_k_idx = similarities.argsort()[-3:][::-1]
retrieved_chunks = [chunks[i] for i in top_k_idx]

# --- Generation phase ---
context = "\n\n".join(retrieved_chunks)
prompt = f"""Answer using ONLY the context below. If not present, say you don't know.

Context:
{context}

Question: {query}
Answer:"""

# response = call_llm(prompt)  # send to your LLM of choice
```

This is the skeleton every production RAG system elaborates on — swapping the brute-force cosine similarity for a real vector DB with ANN search, adding hybrid search + reranking, structure-aware chunking, and evaluation loops as described above.
