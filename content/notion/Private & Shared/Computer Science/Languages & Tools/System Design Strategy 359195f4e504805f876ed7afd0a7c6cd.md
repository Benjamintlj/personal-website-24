# System Design Strategy

## 1. Determine Functional Requirements

- What am I making
- Where is the code supposed to be implemented
- Are there multiple instances of the service
- Are there any weird edge cases

## 2. Determine Non-Functional Requirements

### Scalability

- Throughput - how many requests are received per second
    - Horizontal vs Vertical scaling
- Storage capacity - how much IO, read and write

### Performance

- Availability - number of successful requests / total number of requests
    - Fail-Open vs Fail-Closed (Consider what features would need to Fail-Closed)
- Latency - how long does it take to make a single request

## 3. Design it

### Determine Storage

- In memory store
    - Redis - use when required fast, and not storing alot

### Determine Severs

- New service
    - Good when feature is required across multiple services

- Add to existing service
    - Good when feature only required for a single service

### Algorithm