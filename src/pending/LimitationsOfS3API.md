---
title: Limitations of the S3 API
author: Caitlin Bestler
---
Amazon's S3 is the primary API used to access object storage. However it has a blind spot that makes it suboptimal for any object storage system which stores objects in any way other than as a monolithic blob.

NexentaEdge stores objects as copy-on-write self-validating write-once chunks. Each chunk stores either payload or metadata. This enables efficient storage of multiple versions of the same document because only the chunks that have changed require new storage for the new version. Copy-on-write chunks also support object cloning and multi-object snapshots.

The S3 API gets and puts objects. The API does not address how the object is stored. Normally this type of abstraction is good, but as we will detail treating an object as a blob limits the efficiency of an API. The limitations are particularly harmful when dealing with multiple versions of objects. These limitations at the minimum impact bandwidth, but can also waste storage capacity and IOPs as well.

For example, deduplication of entire object is undesirable:
* The S3 gateway would have to cache the entire object before deciding whether or not to put it. Deduplication does **not** involve comparing the new payload with every existing object. It fingerprints the object and compares the fingerprints. There is no way to check that the fingerprint of an incoming object matches an existing object **so far**.
* Caching the entire object delays the start of saving the object until the entire object has been put. This delays completing the write of the entire object.
* Whole object deduplication is rare. It effectively requires multiple users to put the same document under multiple names. Different versions of the same document will have a lot of redundant material, but only if deduplication is applied with a finer granularity than the whole document.

Applying deduplication to portions of a document is only possible once there is a model of how an object is decomposed into metadata and payload chunks.

NexentaEdge stores objects as variably sized chunks with global deduplication. This includes the metadata about an object version as well as the payload. Chunk-oriented storage optimizes for representing multiple versions of the same objects in that inter-version intra-object deduplication is common.

So we have an object storage system optimized for multiple versions of the same object accessed by an API that does not support editing of objects. Every Put has to supply the entire object. A chunk aware API can allow the client to put a new version by specifying what has changed from a reference version rather than requiring the entire object.

Efficiently supporting edits is only the first benefit of a chunk-aware API.

A chunk-aware API allows applications to choose chunk boundaries. This increase the probability of retaining prior chunks in a new object version, or even of finding common chunks between different objects. Simply choosing boundaries that are application meaningful, such as not splitting documents on paraagraph boundaaries can increase successful deduplication. A chunk-aware API would enable the application to hint at optimal chunk boundaries.

An editing application that is chunk-aware can optimize even further. A long text document might be currently encoded as 50 chunks. If two sentences are inserted in the third paragraph then a chunk aware editor can simply update the first chunk, leaving the remaining chunks as is. But if the API requires submitting the entire payload identifying the common chunks would require a lot of parsing to identify what the actual edits were, when the editor already knew. A chunk-aware API would let the editing application share what it knew about what had actually been edited.

Chunks are globally deduplicated, which avoids redundant storage and network bandwidth - but only *after* the object has been Put using S3. A chunk-aware API would let the client submit the chunk fingerprint before transmitting it to detect duplicates and avoid unnecessary payload retransmission.

Deduplication occurs **after** data compression, because the storage target needs to validate the fingerprint of received and stored chunks. Having to decompress every chunk to validate it before transmitting the compressed chunk would be very time consuming. To avoid this the client must be allowed to compress chunks themselves.

t
When the S3 protocol endpoint is in the data center this can mean that **most** of the path the object takes to ultimately being stored are unoptimized. Deduplication and compression benefits are only achieved in the last feet of the link, not the first miles.

Copy-on-write chunks enable object cloning and snapshotting sets of objects without requiring any payload copying. Different storage systems will vary on exactly how this is done, but being to create a snapshot without having to stop the world while copying vast amounts of payload will always be useful. See some of the previous blogs on how NexentaEdge's snapshots are particularly efficient and powerful.

But, again, the base S3 API provides no support for creating or using snapshots of any kind other than full replication of an existing object.

This document proposes a set extensions to the S3 API to address these limitations. These are strict extensions: additional methods and additional metadata modifiers to existing methods. All of the already defined S3 commands are left as is. The S3 protocol already supports addition of user-defined metadata fields to any object.

But transitioning from an object-oriented API to a chunk-oriented API is not easy:
* Application developers never eagerly embrace new APIs.
* If a new API is to be used new client code has to be deployed. Where and under whose control?
* Can a chunk-aware API be product neutral?
* Are there any security implications involved in exposing the internal details of how an object version is comprised of chunks?

The next blog will explain a specific method for being chunk-aware that enables remote deployment while avoiding needing to expose the details of how metadata is organized.
