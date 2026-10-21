# Service Bus for jobs and events, Kafka for analytics

Status: proposed. Parts not yet reverified by the owner are listed in [reverify.md](../reverify.md).

Service Bus carries the job queue and the events that services react to, such as Catalog updating stock on "order confirmed". Those flows need per-message handling: retries, duplicate detection and dead-lettering. A Kafka-compatible stream carries all order events for analytics. It is Kafka, or Event Hubs with its Kafka endpoint, and that is not decided yet. Event publishing sits behind a small interface, so the transport can change without rewriting the services.

## Considered Options

- **Kafka for the job queue too.** Rejected: Kafka is a log, not a queue. A slow job (a Gemini call can take seconds) blocks the jobs behind it in the same partition, parallel workers are limited by the partition count, and retries and dead-lettering would have to be built.
- **A PostgreSQL jobs table as the queue.** Not chosen: it needs hand-built retries, locking and dead-lettering, and it adds load to the database.
- **A direct HTTP call from the Jobs API to the worker.** Not chosen: a worker crash loses the job, and traffic spikes hit the worker at once.
- **Service Bus for analytics too.** Not chosen: the owner chose Kafka for analytics.

## Consequences

- Two messaging systems to run. The rule: a queue for slow work for one worker, a Service Bus topic for facts that services react to and need duplicate handling, Kafka for analytics streams.
- Orders publishes "order confirmed" to a Service Bus topic and also streams all order events to Kafka. Consumers must tolerate duplicates, and a job ID is the idempotency key when the AI worker creates an order.
- The Kafka stream and its Analytics consumer are planned, not built.
- Revisit trigger: jobs become very many and very fast, or Service Bus limits are reached under load.
