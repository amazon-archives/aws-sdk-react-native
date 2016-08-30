//
// Copyright 2010-2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License").
// You may not use this file except in compliance with the License.
// A copy of the License is located at
//
// http://aws.amazon.com/apache2.0
//
// or in the "license" file accompanying this file. This file is distributed
// on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
// express or implied. See the License for the specific language governing
// permissions and limitations under the License.
//

import React, { Component } from 'react';
import {
  Platform,
  NativeModules,
} from 'react-native';

var DynamoDBClient = NativeModules.AWSRNDynamoDBClient;

export default class AWSDynamoDB{
 /*
  * Represents a AWSDynamoDB class
  * @constructor
  */
  constructor(){

  }
 /*
  * Creates a DynamoDB client with the given region and registers it.
  * @param {string} region - the service region
  * @example
  * InstanceOfDynamoDBClient.initWithOptions({"region":"bucketRegion"})
  */
  initWithOptions(options){
    DynamoDBClient.initWithOptions(options);
  }

 /*
  * The DeleteTable operation deletes a table and all of its items. After a DeleteTable request, the specified table is in the DELETING state until DynamoDB completes the deletion. If the table is in the ACTIVE state, you can delete it. If a table is in CREATING or UPDATING states, then DynamoDB returns a ResourceInUseException. If the specified table does not exist, DynamoDB returns a ResourceNotFoundException. If table is already in the DELETING state, no error is returned.
  * DynamoDB might continue to accept data read and write operations, such as GetItem and PutItem, on a table in the DELETING state until the table deletion is complete.
  * When you delete a table, any indexes on that table are also deleted.
  * If you have DynamoDB Streams enabled on the table, then the corresponding stream on that table goes into the DISABLED state, and the stream is automatically deleted after 24 hours.
  * Use the DescribeTable API to check the status of the table.
  * @param {map} deleteTableInput - Represents the input of a DeleteTable operation. Required Parameters: [TableName]
  */
  async DeleteTable(options){
    var returnValue = await DynamoDBClient.DeleteTable(options);
    return returnValue;
  }

 /*
  * The BatchGetItem operation returns the attributes of one or more items from one or more tables. You identify requested items by primary key.
  * A single operation can retrieve up to 16 MB of data, which can contain as many as 100 items. BatchGetItem will return a partial result if the response size limit is exceeded, the table's provisioned throughput is exceeded, or an internal processing failure occurs. If a partial result is returned, the operation returns a value for UnprocessedKeys. You can use this value to retry the operation starting with the next item to get.
  * If you request more than 100 items BatchGetItem will return a ValidationException with the message "Too many items requested for the BatchGetItem call".
  * For example, if you ask to retrieve 100 items, but each individual item is 300 KB in size, the system returns 52 items (so as not to exceed the 16 MB limit). It also returns an appropriate UnprocessedKeys value so you can get the next page of results. If desired, your application can include its own logic to assemble the pages of results into one data set.
  * If none of the items can be processed due to insufficient provisioned throughput on all of the tables in the request, then BatchGetItem will return a ProvisionedThroughputExceededException. If at least one of the items is successfully processed, then BatchGetItem completes successfully, while returning the keys of the unread items in UnprocessedKeys.
  * If DynamoDB returns any unprocessed items, you should retry the batch operation on those items. However, we strongly recommend that you use an exponential backoff algorithm. If you retry the batch operation immediately, the underlying read or write requests can still fail due to throttling on the individual tables. If you delay the batch operation using exponential backoff, the individual requests in the batch are much more likely to succeed.
  * For more information, see http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ErrorHandling.html#BatchOperations" - Batch Operations and Error Handling in the Amazon DynamoDB Developer Guide.
  * By default, BatchGetItem performs eventually consistent reads on every table in the request. If you want strongly consistent reads instead, you can set ConsistentRead to true for any or all tables.
  * In order to minimize response latency, BatchGetItem retrieves items in parallel.
  * When designing your application, keep in mind that DynamoDB does not return items in any particular order. To help parse the response by item, include the primary key values for the items in your request in the AttributesToGet parameter.
  * If a requested item does not exist, it is not returned in the result. Requests for nonexistent items consume the minimum read capacity units according to the type of read. For more information, see http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/WorkingWithTables.html#CapacityUnitCalculations" - Capacity Units Calculations in the Amazon DynamoDB Developer Guide.
  * @param {map} batchGetItemInput - Represents the input of a BatchGetItem operation. Required Parameters: [RequestItems]
  */
  async BatchGetItem(options){
    var returnValue = await DynamoDBClient.BatchGetItem(options);
    return returnValue;
  }

 /*
  * Returns information about the table, including the current status of the table, when it was created, the primary key schema, and any indexes on the table.
  * If you issue a DescribeTable request immediately after a CreateTable request, DynamoDB might return a ResourceNotFoundException. This is because DescribeTable uses an eventually consistent query, and the metadata for your table might not be available at that moment. Wait for a few seconds, and then try the DescribeTable request again.
  * @param {map} describeTableInput - Represents the input of a DescribeTable operation. Required Parameters: [TableName]
  */
  async DescribeTable(options){
    var returnValue = await DynamoDBClient.DescribeTable(options);
    return returnValue;
  }

 /*
  * Creates a new item, or replaces an old item with a new item. If an item that has the same primary key as the new item already exists in the specified table, the new item completely replaces the existing item. You can perform a conditional put operation (add a new item if one with the specified primary key doesn't exist), or replace an existing item if it has certain attribute values.
  * In addition to putting an item, you can also return the item's attribute values in the same operation, using the ReturnValues parameter.
  * When you add an item, the primary key attribute(s) are the only required attributes. Attribute values cannot be null. String and Binary type attributes must have lengths greater than zero. Set type attributes cannot be empty. Requests with empty values will be rejected with a ValidationException exception.
  * You can request that PutItem return either a copy of the original item (before the update) or a copy of the updated item (after the update). For more information, see the ReturnValues description below.
  * To prevent a new item from replacing an existing item, use a conditional expression that contains the attribute_not_exists function with the name of the attribute being used as the partition key for the table. Since every record must contain that attribute, the attribute_not_exists function will only succeed if no matching item exists.
  * For more information about using this API, see http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/WorkingWithItems.html" - Working with Items in the Amazon DynamoDB Developer Guide.
  * @param {map} putItemInput - Represents the input of a PutItem operation. Required Parameters: [TableName, Item]
  */
  async PutItem(options){
    var returnValue = await DynamoDBClient.PutItem(options);
    return returnValue;
  }

 /*
  * A Query operation uses the primary key of a table or a secondary index to directly access items from that table or index.
  * Use the KeyConditionExpression parameter to provide a specific value for the partition key. The Query operation will return all of the items from the table or index with that partition key value. You can optionally narrow the scope of the Query operation by specifying a sort key value and a comparison operator in KeyConditionExpression. You can use the ScanIndexForward parameter to get results in forward or reverse order, by sort key.
  * Queries that do not return results consume the minimum number of read capacity units for that type of read operation.
  * If the total number of items meeting the query criteria exceeds the result set size limit of 1 MB, the query stops and results are returned to the user with the LastEvaluatedKey element to continue the query in a subsequent operation. Unlike a Scan operation, a Query operation never returns both an empty result set and a LastEvaluatedKey value. LastEvaluatedKey is only provided if you have used the Limit parameter, or if the result set exceeds 1 MB (prior to applying a filter).
  * You can query a table, a local secondary index, or a global secondary index. For a query on a table or on a local secondary index, you can set the ConsistentRead parameter to true and obtain a strongly consistent result. Global secondary indexes support eventually consistent reads only, so do not specify ConsistentRead when querying a global secondary index.
  * @param {map} queryInput - Represents the input of a Query operation. Required Parameters: [TableName]
  */
  async Query(options){
    var returnValue = await DynamoDBClient.Query(options);
    return returnValue;
  }

 /*
  * The Scan operation returns one or more items and item attributes by accessing every item in a table or a secondary index. To have DynamoDB return fewer items, you can provide a ScanFilter operation.
  * If the total number of scanned items exceeds the maximum data set size limit of 1 MB, the scan stops and results are returned to the user as a LastEvaluatedKey value to continue the scan in a subsequent operation. The results also include the number of items exceeding the limit. A scan can result in no table data meeting the filter criteria.
  * By default, Scan operations proceed sequentially; however, for faster performance on a large table or secondary index, applications can request a parallel Scan operation by providing the Segment and TotalSegments parameters. For more information, see http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/QueryAndScan.html#QueryAndScanParallelScan" - Parallel Scan in the Amazon DynamoDB Developer Guide.
  * By default, Scan uses eventually consistent reads when accessing the data in a table; therefore, the result set might not include the changes to data in the table immediately before the operation began. If you need a consistent copy of the data, as of the time that the Scan begins, you can set the ConsistentRead parameter to true.
  * @param {map} scanInput - Represents the input of a Scan operation. Required Parameters: [TableName]
  */
  async Scan(options){
    var returnValue = await DynamoDBClient.Scan(options);
    return returnValue;
  }

 /*
  * Deletes a single item in a table by primary key. You can perform a conditional delete operation that deletes the item if it exists, or if it has an expected attribute value.
  * In addition to deleting an item, you can also return the item's attribute values in the same operation, using the ReturnValues parameter.
  * Unless you specify conditions, the DeleteItem is an idempotent operation; running it multiple times on the same item or attribute does not result in an error response.
  * Conditional deletes are useful for deleting items only if specific conditions are met. If those conditions are met, DynamoDB performs the delete. Otherwise, the item is not deleted.
  * @param {map} deleteItemInput - Represents the input of a DeleteItem operation. Required Parameters: [TableName, Key]
  */
  async DeleteItem(options){
    var returnValue = await DynamoDBClient.DeleteItem(options);
    return returnValue;
  }

 /*
  * Edits an existing item's attributes, or adds a new item to the table if it does not already exist. You can put, delete, or add attribute values. You can also perform a conditional update on an existing item (insert a new attribute name-value pair if it doesn't exist, or replace an existing name-value pair if it has certain expected attribute values).
  * You can also return the item's attribute values in the same UpdateItem operation using the ReturnValues parameter.
  * @param {map} updateItemInput - Represents the input of an UpdateItem operation. Required Parameters: [TableName, Key]
  */
  async UpdateItem(options){
    var returnValue = await DynamoDBClient.UpdateItem(options);
    return returnValue;
  }

 /*
  * The CreateTable operation adds a new table to your account. In an AWS account, table names must be unique within each region. That is, you can have two tables with same name if you create the tables in different regions.
  *  CreateTable is an asynchronous operation. Upon receiving a CreateTable request, DynamoDB immediately returns a response with a TableStatus of CREATING. After the table is created, DynamoDB sets the TableStatus to ACTIVE. You can perform read and write operations only on an ACTIVE table.
  * You can optionally define secondary indexes on the new table, as part of the CreateTable operation. If you want to create multiple tables with secondary indexes on them, you must create the tables sequentially. Only one table with secondary indexes can be in the CREATING state at any given time.
  * You can use the DescribeTable API to check the table status.
  * @param {map} createTableInput - Represents the input of a CreateTable operation. Required Parameters: [AttributeDefinitions, TableName, KeySchema, ProvisionedThroughput]
  */
  async CreateTable(options){
    var returnValue = await DynamoDBClient.CreateTable(options);
    return returnValue;
  }

 /*
  * The BatchWriteItem operation puts or deletes multiple items in one or more tables. A single call to BatchWriteItem can write up to 16 MB of data, which can comprise as many as 25 put or delete requests. Individual items to be written can be as large as 400 KB.
  *  BatchWriteItem cannot update items. To update items, use the UpdateItem API.
  * The individual PutItem and DeleteItem operations specified in BatchWriteItem are atomic; however BatchWriteItem as a whole is not. If any requested operations fail because the table's provisioned throughput is exceeded or an internal processing failure occurs, the failed operations are returned in the UnprocessedItems response parameter. You can investigate and optionally resend the requests. Typically, you would call BatchWriteItem in a loop. Each iteration would check for unprocessed items and submit a new BatchWriteItem request with those unprocessed items until all items have been processed.
  * Note that if none of the items can be processed due to insufficient provisioned throughput on all of the tables in the request, then BatchWriteItem will return a ProvisionedThroughputExceededException.
  * If DynamoDB returns any unprocessed items, you should retry the batch operation on those items. However, we strongly recommend that you use an exponential backoff algorithm. If you retry the batch operation immediately, the underlying read or write requests can still fail due to throttling on the individual tables. If you delay the batch operation using exponential backoff, the individual requests in the batch are much more likely to succeed.
  * For more information, see http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ErrorHandling.html#BatchOperations" - Batch Operations and Error Handling in the Amazon DynamoDB Developer Guide.
  * With BatchWriteItem, you can efficiently write or delete large amounts of data, such as from Amazon Elastic MapReduce (EMR), or copy data from another database into DynamoDB. In order to improve performance with these large-scale operations, BatchWriteItem does not behave in the same way as individual PutItem and DeleteItem calls would. For example, you cannot specify conditions on individual put and delete requests, and BatchWriteItem does not return deleted items in the response.
  * If you use a programming language that supports concurrency, you can use threads to write items in parallel. Your application must include the necessary logic to manage the threads. With languages that don't support threading, you must update or delete the specified items one at a time. In both situations, BatchWriteItem provides an alternative where the API performs the specified put and delete operations in parallel, giving you the power of the thread pool approach without having to introduce complexity into your application.
  * Parallel processing reduces latency, but each specified put and delete request consumes the same number of write capacity units whether it is processed in parallel or not. Delete operations on nonexistent items consume one write capacity unit.
  * If one or more of the following is true, DynamoDB rejects the entire batch write operation:
  * One or more tables specified in the BatchWriteItem request does not exist.
  * Primary key attributes specified on an item in the request do not match those in the corresponding table's primary key schema.
  * You try to perform multiple operations on the same item in the same BatchWriteItem request. For example, you cannot put and delete the same item in the same BatchWriteItem request.
  * There are more than 25 requests in the batch.
  * Any individual item in a batch exceeds 400 KB.
  * The total request size exceeds 16 MB.
  * @param {map} batchWriteItemInput - Represents the input of a BatchWriteItem operation. Required Parameters: [RequestItems]
  */
  async BatchWriteItem(options){
    var returnValue = await DynamoDBClient.BatchWriteItem(options);
    return returnValue;
  }

 /*
  * The GetItem operation returns a set of attributes for the item with the given primary key. If there is no matching item, GetItem does not return any data.
  *  GetItem provides an eventually consistent read by default. If your application requires a strongly consistent read, set ConsistentRead to true. Although a strongly consistent read might take more time than an eventually consistent read, it always returns the last updated value.
  * @param {map} getItemInput - Represents the input of a GetItem operation. Required Parameters: [TableName, Key]
  */
  async GetItem(options){
    var returnValue = await DynamoDBClient.GetItem(options);
    return returnValue;
  }

 /*
  * Returns the current provisioned-capacity limits for your AWS account in a region, both for the region as a whole and for any one DynamoDB table that you create there.
  * When you establish an AWS account, the account has initial limits on the maximum read capacity units and write capacity units that you can provision across all of your DynamoDB tables in a given region. Also, there are per-table limits that apply when you create a table there. For more information, see http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Limits.html" - Limits page in the Amazon DynamoDB Developer Guide.
  * Although you can increase these limits by filing a case at https://console.aws.amazon.com/support/home#/" - AWS Support Center, obtaining the increase is not instantaneous. The DescribeLimits API lets you write code to compare the capacity you are currently using to those limits imposed by your account so that you have enough time to apply for an increase before you hit a limit.
  * For example, you could use one of the AWS SDKs to do the following:
  * Call DescribeLimits for a particular region to obtain your current account limits on provisioned capacity there.
  * Create a variable to hold the aggregate read capacity units provisioned for all your tables in that region, and one to hold the aggregate write capacity units. Zero them both.
  * Call ListTables to obtain a list of all your DynamoDB tables.
  * For each table name listed by ListTables, do the following:
  * Call DescribeTable with the table name.
  * Use the data returned by DescribeTable to add the read capacity units and write capacity units provisioned for the table itself to your variables.
  * If the table has one or more global secondary indexes (GSIs), loop over these GSIs and add their provisioned capacity values to your variables as well.
  * Report the account limits for that region returned by DescribeLimits, along with the total current provisioned capacity levels you have calculated.
  * This will let you see whether you are getting close to your account-level limits.
  * The per-table limits apply only when you are creating a new table. They restrict the sum of the provisioned capacity of the new table itself and all its global secondary indexes.
  * For existing tables and their GSIs, DynamoDB will not let you increase provisioned capacity extremely rapidly, but the only upper limit that applies is that the aggregate provisioned capacity over all your tables and GSIs cannot exceed either of the per-account limits.
  *  DescribeLimits should only be called periodically. You can expect throttling errors if you call it more than once in a minute.
  * The DescribeLimits Request element has no content.
  * @param {map} describeLimitsInput - Represents the input of a DescribeLimits operation. Has no content.
  */
  async DescribeLimits(options){
    var returnValue = await DynamoDBClient.DescribeLimits(options);
    return returnValue;
  }

 /*
  * Returns an array of table names associated with the current account and endpoint. The output from ListTables is paginated, with each page returning a maximum of 100 table names.
  * @param {map} listTablesInput - Represents the input of a ListTables operation.
  */
  async ListTables(options){
    var returnValue = await DynamoDBClient.ListTables(options);
    return returnValue;
  }

 /*
  * Modifies the provisioned throughput settings, global secondary indexes, or DynamoDB Streams settings for a given table.
  * You can only perform one of the following operations at once:
  * Modify the provisioned throughput settings of the table.
  * Enable or disable Streams on the table.
  * Remove a global secondary index from the table.
  * Create a new global secondary index on the table. Once the index begins backfilling, you can use UpdateTable to perform other operations.
  *  UpdateTable is an asynchronous operation; while it is executing, the table status changes from ACTIVE to UPDATING. While it is UPDATING, you cannot issue another UpdateTable request. When the table returns to the ACTIVE state, the UpdateTable operation is complete.
  * @param {map} updateTableInput - Represents the input of an UpdateTable operation. Required Parameters: [TableName]
  */
  async UpdateTable(options){
    var returnValue = await DynamoDBClient.UpdateTable(options);
    return returnValue;
  }



}
