# Production Engineering Directive for AI Coding Agents

This document defines mandatory operational patterns, architectural standards, and implementation rules for code generation. When generating applications or backend services, adhere to these 111 principles.

---

## System Architecture & Traffic Management

1. **Rate Limiting:** Protect APIs with token bucket or leaky bucket algorithms (e.g., Redis-backed `express-rate-limit`).
2. **Caching:** Implement multi-level caching (in-memory L1, distributed L2 via Redis) for frequent read workloads.
3. **Load Balancing:** Assume multi-instance deployment behind L7 load balancers; avoid local session state.
4. **Reverse Proxies:** Route traffic via NGINX/Envoy for TLS termination, compression, and request routing.
5. **API Gateways:** Centralize authentication, rate limiting, logging, and routing at the ingress layer.

---

## Resilience & Fault Tolerance

6. **CI/CD:** Structure code for automated linting, unit testing, container building, and deployment pipelines.
7. **Docker:** Provide minimal multi-stage `Dockerfile` configurations using light base images (e.g., Alpine/Distroless).
8. **Kubernetes:** Design services to read configuration from environment variables and handle OS signals (`SIGTERM`).
9. **Service Discovery:** Resolve service addresses dynamically via DNS or service registries rather than hardcoded URLs.
10. **Circuit Breakers:** Wrap external calls with circuit breakers (e.g., Resilience4j, Cockatiel) to prevent cascading failures.
11. **Timeouts:** Set strict connect and read timeouts on every outbound HTTP or RPC call.
12. **Retries:** Retry transient operations (network hiccups, 503s) with capped maximum retry attempts.
13. **Exponential Backoff:** Apply randomized exponential backoff with full jitter to all retry loops.
14. **Idempotency:** Require unique idempotency keys (`X-Idempotency-Key`) for all non-idempotency operations (POST/PUT).

---

## Messaging & Async Processing

15. **Message Queues:** Offload heavy work to background queues (e.g., BullMQ, RabbitMQ, SQS).
16. **Pub/Sub:** Decouple event producers from consumers using publish-subscribe messaging models.
17. **Event-Driven Architecture:** Emit state-change events rather than executing synchronous inter-service calls.
18. **Distributed Transactions:** Avoid 2-Phase Commit (2PC); rely on eventual consistency via event streams.
19. **Saga Pattern:** Implement multi-step distributed workflows as Sagas with explicit compensating transactions.
20. **Dead Letter Queues (DLQ):** Route repeatedly failing messages to a DLQ for manual inspection and alert generation.
21. **Cron Jobs:** Decouple scheduled tasks from primary API servers; execute via isolated worker services or Kubernetes CronJobs.

---

## Real-Time Communication

22. **WebSockets:** Use full-duplex WebSockets for real-time bidirectional messaging; implement heartbeat ping/pongs.
23. **Long Polling:** Fall back to long polling only when persistent socket connections are unsupported.
24. **Server-Sent Events (SSE):** Use SSE over WebSockets for unidirectional server-to-client updates.

---

## Database Management & Performance

25. **Database Indexing:** Index foreign keys, high-cardinality query fields, and sorting columns. Avoid over-indexing.
26. **Query Optimization:** Select only required columns (`SELECT col1, col2`), avoid wildcards (`SELECT *`), and analyze `EXPLAIN ANALYZE`.
27. **N+1 Queries:** Eliminate N+1 queries using eager loading, joins, or batching strategies (e.g., DataLoader).
28. **Connection Pooling:** Always connect through a managed pool (e.g., `pg-pool`, HikariCP) with tuned min/max bounds.
29. **Read Replicas:** Route read-only queries to database read replicas to preserve primary node capacity.
30. **Sharding:** Partition data horizontally across distinct database instances based on a consistent shard key.
31. **Partitioning:** Divide large table structures locally by range or hash (e.g., date ranges) for fast prune times.
32. **Replication:** Ensure data redundantly streams across availability zones (synchronous or asynchronous).
33. **Leader Election:** Rely on consensus algorithms (Raft, Paxos) or distributed locks for single-master task execution.

---

## Concurrency & Data Consistency

34. **CAP Theorem:** Decide intentionally between Consistency (CP) or Availability (AP) during network partitions.
35. **Eventual Consistency:** Design user interfaces and systems to handle asynchronous state synchronization gracefully.
36. **Optimistic Locking:** Use version fields (`version_id`) on records to detect concurrently modified data.
37. **Pessimistic Locking:** Use row-level explicit locks (`SELECT ... FOR UPDATE`) only for high-contention financial state.
38. **Distributed Locks:** Acquire expiring lock keys in Redis (Redlock) or ZooKeeper for distributed critical sections.
39. **Race Conditions:** Avoid read-then-write patterns in application memory; use atomic database operations (`UPDATE ... SET count = count + 1`).
40. **Deadlocks:** Acquire locks in a deterministic order across all code paths to prevent lock cycles.
41. **Memory Leaks:** Unbind event listeners, clear unmanaged timers, and avoid global variable accumulation.
42. **Garbage Collection:** Minimize object allocation rates in high-throughput hot paths to avoid GC pause spikes.
43. **Thread Safety:** Ensure shared state mutation is protected via locks, atomic types, or immutable structures.
44. **Backpressure:** Pause upstream consumption when downstream buffers exceed high-water marks.

---

## Scalability & Edge Computing

45. **Autoscaling:** Configure dynamic scale rules based on CPU, memory, or queue depth metrics.
46. **Horizontal Scaling:** Keep compute layers stateless so instances can be scaled out endlessly.
47. **Vertical Scaling:** Size single instances correctly for memory/CPU bound operations before scaling horizontally.
48. **CDN:** Serve all static media assets and immutable bundles via Content Delivery Networks.
49. **Edge Caching:** Cache non-personalized API responses at edge locations with explicit `Cache-Control` headers.
50. **Cache Invalidation:** Implement explicit invalidation strategies (TTL, surrogate keys/stale-while-revalidate).

---

## Deployments & Feature Management

51. **Feature Flags:** Wrap incomplete features or experiments in flag checks (e.g., LaunchDarkly, Unleash).
52. **Blue-Green Deployment:** Support zero-downtime releases by shifting complete traffic between twin environments.
53. **Canary Releases:** Roll out new deployments incrementally to a sub-percentage (e.g., 5%) of production traffic.
54. **Rolling Deployments:** Update application instances gradually, maintaining minimum available replica counts.
55. **Rollbacks:** Ensure code and schema updates are fully backwards-compatible to permit immediate rollbacks.

---

## Observability & Operations

56. **Health Checks:** Expose internal runtime readiness checks separate from network availability.
57. **Liveness & Readiness Probes:**
    - `Liveness`: Verifies process health (restart on failure).
    - `Readiness`: Verifies dependency connection (remove from traffic pool on failure).
58. **Monitoring:** Collect standard RED (Rate, Errors, Duration) and USE (Utilization, Saturation, Errors) metrics.
59. **Logging:** Produce structured JSON logs containing timestamp, log level, message, context, and trace IDs.
60. **Distributed Tracing:** Propagate context headers (e.g., `traceparent`, `x-request-id`) across microservice boundaries.
61. **Metrics:** Expose Prometheus counters, gauges, and histograms for runtime internals.
62. **Alerts:** Trigger alerts based on actionable service degradation rather than benign log noise.
63. **SLOs (Service Level Objectives):** Target measurable reliability goals (e.g., 99.9% uptime).
64. **SLIs (Service Level Indicators):** Measure live metrics representing SLO compliance (e.g., successful request ratio).
65. **Error Budgets:** Track remaining allowable downtime; halt non-essential releases when budgets exhaust.
66. **Observability:** Integrate metrics, logs, and traces into a single correlated telemetry system.

---

## Security & Authentication

67. **Secrets Management:** Never hardcode credentials. Fetch secrets at runtime from tools like HashiCorp Vault or AWS Secrets Manager.
68. **IAM:** Enforce Principle of Least Privilege across service roles, database users, and cloud resources.
69. **OAuth:** Use OAuth 2.0 / OIDC for user authorization and authentication flows.
70. **JWT Rotation:** Keep JWT lifespans short; enforce refresh tokens with automatic token family rotation.
71. **TLS:** Enforce HTTPS/TLS 1.3 for all public end-points and internal service communication (mTLS).
72. **Encryption at Rest:** Enforce KMS/AES-256 encryption on disk volumes, databases, and object stores.
73. **Encryption in Transit:** Encrypt all intra-service network packets across public and private channels.
74. **WAF:** Position Web Application Firewalls ahead of public endpoints to filter common exploit traffic.
75. **DDoS Protection:** Enable network layer scrubbing (e.g., Cloudflare, AWS Shield) for volumetric attacks.
76. **CORS:** Maintain explicit, strict origin allowlists on HTTP response headers (`Access-Control-Allow-Origin`).
77. **CSRF:** Use anti-CSRF tokens and `SameSite=Strict` or `Lax` cookie attributes for browser sessions.
78. **SQL Injection:** Parameterize all database queries; never concatenate input strings into raw SQL execution.
79. **XSS:** Sanitize and encode user input prior to DOM insertion; define strong `Content-Security-Policy` headers.
80. **SSRF:** Validate, sanitize, and restrict outgoing HTTP requests initiated by server processes.

---

## Database Lifecycle & Reliability

81. **Database Migrations:** Manage schema changes using automated versioned migration tools (e.g., Prisma, Flyway, Liquibase).
82. **Schema Versioning:** Apply backward-compatible migrations (Expand and Contract pattern) to avoid downtime.
83. **Disaster Recovery:** Define tested RTO (Recovery Time Objective) and RPO (Recovery Point Objective) metrics.
84. **Backups:** Perform automated daily backups with regular automated restore tests.
85. **Failover:** Enable automated failover mechanisms for primary database instances and infrastructure dependencies.
86. **Multi-Region Deployment:** Architect data replication across independent geographic regions for maximum fault isolation.
87. **Chaos Engineering:** Intentionally introduce system failures in controlled environments to verify system resilience.

---

## Performance Tuning & Serverless

88. **Cost Optimization:** Monitor resource usage, utilize spot instances, and clean up orphan resources.
89. **Cold Starts:** Keep serverless bundles small and optimize initialization routines to lower cold start latency.
90. **Serverless Limits:** Manage execution timeouts, payload size bounds, and concurrency quotas.
91. **Latency:** Minimize network hops, serialize efficient payloads (e.g., Protobuf), and reduce sync call chains.
92. **Throughput:** Maximize concurrent batching and non-blocking asynchronous I/O loops.
93. **P99 Latency:** Monitor 99th percentile response duration to identify long-tail user friction.
94. **Tail Latency:** Mitigate slow outlier responses using speculative execution or hedge requests.

---

## Networking & Protocols

95. **Network Partitions:** Ensure applications fail safely and avoid split-brain states during inter-node isolation.
96. **Clock Skew:** Rely on NTP time synchronization; avoid ordering logic derived strictly from system clocks.
97. **DNS:** Cache DNS responses respecting TTLs and configure failover routing rules.
98. **TCP vs UDP:** Use TCP for reliable, ordered delivery; use UDP for latency-critical, loss-tolerant transmissions.
99. **HTTP/2 & HTTP/3:** Utilize HTTP/2 (multiplexing) and HTTP/3 (QUIC) for client-facing protocol efficiency.
100. **gRPC:** Use gRPC/Protobuf for high-performance, low-latency inter-service communication.

---

## Developer Experience & Tooling

101. **Webhooks:** Deliver webhooks with signature verification (`HMAC-SHA256`) and retry schedules.
102. **API Versioning:** Version public APIs via URIs (`/v1/resource`) or request headers.
103. **Semantic Versioning:** Tag releases strictly using `MAJOR.MINOR.PATCH` versioning convention.
104. **Infrastructure as Code (IaC):** Declaratively define all infrastructure resources in code repositories.
105. **Terraform:** Maintain modular, state-locked Terraform scripts for all environment provisioning.
106. **Helm Charts:** Package Kubernetes application manifests using parameterized Helm charts.
107. **Build Caching:** Maximize CI build cache hits by ordering docker layer instructions logically.
108. **Dependency Hell:** Pin explicit lockfiles (`package-lock.json`, `Cargo.lock`, `poetry.lock`) to avoid version drift.

---

## Incident Management & Culture

109. **Production Incidents:** Maintain runbooks and automated alerting protocols for rapid incident mitigation.
110. **On-Call:** Establish clear, automated escalation policies for primary and secondary on-call shifts.
111. **Postmortems:** Conduct blameless postmortems following incidents to identify root causes and preventive action items.