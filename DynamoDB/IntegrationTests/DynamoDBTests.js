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
  NativeModules,
  NativeAppEventEmitter,
  DeviceEventEmitter
} from 'react-native';

import {AWSDynamoDB} from 'aws-sdk-react-native-dynamodb';
import {AWSCognitoCredentials} from 'aws-sdk-react-native-core';

var tables = [];
var cognitoRegion = "INSERTCOGNITOREGION";
var identity_pool_id = "INSERTIDENTITYPOOLID";
var serviceRegion = "INSERTSERVICEREGION";
var hashTableName = "HashTableExample"
var hashRangeTableName = "HashRangeTableExample";
var shouldResolve = false;
export default class DynamoDBTests{

  constructor(){
    shouldResolve = false;
  }

  async Setup() : Promise<any> {
    shouldResolve = false;
    Promise.all([AWSCognitoCredentials.initWithOptions({"region":cognitoRegion,"identity_pool_id":identity_pool_id})]).then(()=>{
      AWSDynamoDB.initWithOptions({"region":serviceRegion});
    });
    return shouldResolve;
  }

  async GetTableNames() : Promise<any>{
    try{
      var response = await AWSDynamoDB.ListTables({});
      return response.TableNames;
    }catch(e){
      console.log(e);
      shouldResolve = false;
      return;
    }
  }

  async WaitForTableStatus(tables, status) : Promise<any> {
    if(status === "DELETED"){
      var TablesWaiting = tables.slice();
      var index = 0;
      while(TablesWaiting.length != 0 ){
        try{
          var output = await AWSDynamoDB.DescribeTable({"TableName":TablesWaiting[index]});
        }catch(e){
          var userInfo = e.message;
          if(userInfo.includes("not found")){
            TablesWaiting.splice(index, 1);
          }else{
            console.error("Different error produced: " + userInfo);
            shouldResolve = false;
            return shouldResolve;
          }
        }
        index = index + 1;
        index = index % TablesWaiting.length;
        if(status === null){
        }
        if(output.Table.TableStatus === status){
          TablesWaiting.splice(index,1);
        }
        index = index + 1;
        index = index % TablesWaiting.length;
      }
    }else{
      var TablesWaiting = tables.slice();
      var index = 0;
      while(TablesWaiting.length != 0 ){
        var output = await AWSDynamoDB.DescribeTable({"TableName":TablesWaiting[index]});
        if(status === null){
        }
        if(output.Table.TableStatus === status){
          TablesWaiting.splice(index,1);
        }
        index = index + 1;
        index = index % TablesWaiting.length;
      }
    }
  }

  async TestTableCallsAsync() : Promise<any> {
    try{
      await this.Setup();
      var tableNames = await this.GetTableNames();
      var tableCount = tableNames.length;
      //create hashkey table
      var tablename = "AWSRNSampleTable1" ;
      var CreateTableRequest= {
        "TableName" : tablename,
        "AttributeDefinitions" : [
          {"AttributeName" : "Id", "AttributeType" : "N"}
        ],
        "KeySchema" : [
          {"KeyType" : "HASH", "AttributeName" : "Id"}
        ],
        "ProvisionedThroughput":{"ReadCapacityUnits":5,"WriteCapacityUnits":5}
      }
      await AWSDynamoDB.CreateTable(CreateTableRequest);
      tables.push(tablename);
      //create hash-and-range-key table
      tablename = "AWSRNSampleTable2";
      CreateTableRequest= {
        "TableName" : tablename,
        "AttributeDefinitions" : [
          {"AttributeName" : "Id", "AttributeType" : "N"},
          {"AttributeName" : "Name", "AttributeType" : "S"}
        ],
        "KeySchema" : [
          {"KeyType" : "HASH", "AttributeName" : "Id"},
          {"KeyType" : "RANGE", "AttributeName" : "Name"}
        ],
        "ProvisionedThroughput":{"ReadCapacityUnits":5,"WriteCapacityUnits":5}
      }
      await AWSDynamoDB.CreateTable(CreateTableRequest);
      tables.push(tablename);
      // Create hash-key table with global index
      tablename = "AWSRNSampleTable3";
      CreateTableRequest= {
        "TableName" : tablename,
        "AttributeDefinitions" : [
          {"AttributeName" : "Id", "AttributeType" : "N"},
          {"AttributeName" : "Company", "AttributeType" : "S"},
          {"AttributeName" : "Price", "AttributeType" : "N"}
        ],
        "KeySchema" : [
          {"KeyType" : "HASH", "AttributeName" : "Id"}
        ],
        "GlobalSecondaryIndexes" : [{
          "IndexName" : "GlobalIndex",
          "KeySchema" : [
            {"AttributeName":"Company","KeyType":"HASH"},
            {"AttributeName":"Price","KeyType":"RANGE"}
          ],
          "ProvisionedThroughput" : {"ReadCapacityUnits":1,"WriteCapacityUnits":1},
          "Projection" : {"ProjectionType":"ALL"}
        }],
        "ProvisionedThroughput":{"ReadCapacityUnits":5,"WriteCapacityUnits":5}
      }
      await AWSDynamoDB.CreateTable(CreateTableRequest);
      tables.push(tablename);
      // Wait for tables to be ready before creating another table with an index
      await this.WaitForTableStatus(tables,"ACTIVE");
      tablename = "AWSRNSampleTable4";
      CreateTableRequest= {
        "TableName" : tablename,
        "AttributeDefinitions" : [
          {"AttributeName" : "Id", "AttributeType" : "N"},
          {"AttributeName" : "Name", "AttributeType" : "S"},
          {"AttributeName" : "Company", "AttributeType" : "S"},
          {"AttributeName" : "Price", "AttributeType" : "N"},
          {"AttributeName" : "Manager", "AttributeType" : "S"}
        ],
        "KeySchema" : [
          {"KeyType" : "HASH", "AttributeName" : "Id"},
          {"KeyType" : "RANGE", "AttributeName" : "Name"}
        ],
        "GlobalSecondaryIndexes" : [{
          "IndexName" : "GlobalIndex",
          "KeySchema" : [
            {"AttributeName":"Company","KeyType":"HASH"},
            {"AttributeName":"Price","KeyType":"RANGE"}
          ],
          "ProvisionedThroughput" : {"ReadCapacityUnits":1,"WriteCapacityUnits":1},
          "Projection" : {"ProjectionType":"ALL"}
        }],
        "LocalSecondaryIndexes":[{
          "IndexName" : "LocalIndex",
          "KeySchema" : [
            {"KeyType" : "HASH", "AttributeName" : "Id"},
            {"KeyType" : "RANGE", "AttributeName" : "Manager"},
          ],
          "Projection" : {
            "ProjectionType" : "INCLUDE",
            "NonKeyAttributes" : ["Company","Price"]
          }
        }],
        "ProvisionedThroughput":{"ReadCapacityUnits":5,"WriteCapacityUnits":5}
      }
      await AWSDynamoDB.CreateTable(CreateTableRequest);
      tables.push(tablename);

      await this.WaitForTableStatus(tables,"ACTIVE");

      var newTableNames = await this.GetTableNames();
      var newTableCount = newTableNames.length;
      var tmpTableCount = tableCount + 4;
      if(newTableCount !== tmpTableCount ){
        console.error("oldTableCount + 4 is not equal to new table count. newTableCount: " + newTableCount);
        shouldResolve = false;
        return shouldResolve;
      }

      //wait for tables to be ready
      await this.WaitForTableStatus(tables,"ACTIVE");

      var UpdateTableRequest = {
        "TableName" : "AWSRNSampleTable2",
        "ProvisionedThroughput" : {"ReadCapacityUnits":10,"WriteCapacityUnits":10}
      }
      await AWSDynamoDB.UpdateTable(UpdateTableRequest);
      //wait for tables to be ready
      await this.WaitForTableStatus(["AWSRNSampleTable2"],"ACTIVE");

      var DeleteTableRequest = {
        "TableName" : "AWSRNSampleTable1"
      }
      await AWSDynamoDB.DeleteTable(DeleteTableRequest);
      DeleteTableRequest = {
        "TableName" : "AWSRNSampleTable2"
      }
      await AWSDynamoDB.DeleteTable(DeleteTableRequest);
      DeleteTableRequest = {
        "TableName" : "AWSRNSampleTable3"
      }
      await AWSDynamoDB.DeleteTable(DeleteTableRequest);
      DeleteTableRequest = {
        "TableName" : "AWSRNSampleTable4"
      }
      await AWSDynamoDB.DeleteTable(DeleteTableRequest);
      await this.WaitForTableStatus(tables,"DELETED");
      var newTableNames = await this.GetTableNames();
      var newTableCount = tableNames.length;
      if(newTableCount !== tableCount){
        console.error("newTableCount after deleting is not equal to old table count. newTableCount: " + newTableCount);
        shouldResolve = false;
        return shouldResolve;
      }
      shouldResolve = true;
      return shouldResolve;
    }catch(e){
      console.error(e);
      shouldResolve = false;
      return shouldResolve;
    }
  }

  async TestHashTable() : Promise<any> {
    try{
      await this.Setup();
      var CreateTableRequest= {
        "TableName" : hashTableName,
        "AttributeDefinitions" : [
          {"AttributeName" : "Id", "AttributeType" : "N"},
          {"AttributeName" : "Company", "AttributeType" : "S"},
          {"AttributeName" : "Price", "AttributeType" : "N"}
        ],
        "KeySchema" : [
          {"KeyType" : "HASH", "AttributeName" : "Id"}
        ],
        "GlobalSecondaryIndexes" : [{
          "IndexName" : "GlobalIndex",
          "KeySchema" : [
            {"AttributeName":"Company","KeyType":"HASH"},
            {"AttributeName":"Price","KeyType":"RANGE"}
          ],
          "ProvisionedThroughput" : {"ReadCapacityUnits":1,"WriteCapacityUnits":1},
          "Projection" : {"ProjectionType":"ALL"}
        }],
        "ProvisionedThroughput":{"ReadCapacityUnits":5,"WriteCapacityUnits":5}
      }
      await AWSDynamoDB.CreateTable(CreateTableRequest);
      await this.WaitForTableStatus([hashTableName],"ACTIVE");


      var nonEmptyListAV = {"L":[{"S":"Data"},{"N":"12"}]};
      if(nonEmptyListAV.L.length !== 2){
        console.error("nonEmptyListAV is not of length two. length: " + nonEmptyListAV.L.length);
        shouldResolve = false;
        return shouldResolve;
      }
      var emptyListAV = {"L":[]};
      if(emptyListAV.L.length !== 0){
        console.error("emptyListAV is not of length 0. length: " + emptyListAV.L.length);
        shouldResolve = false;
        return shouldResolve;
      }
      var boolAV = {"BOOL":false};
      if(boolAV.BOOL){
        console.error("boolAV is not false " + boolAV.BOOL);
        shouldResolve = false;
        return shouldResolve;
      }
      var PutItemRequest = {
        "TableName":hashTableName,
        "Item":{
          "Id" : {"N":"1"},
          "Product" : {"S" : "CloudSpotter"},
          "Company" : {"S" : "CloudsAreGrate"},
          "Tags" : {"SS" : ["Prod","1.0"]},
          "Seller" : {"S" : "Big River"},
          "Price" : {"N" : "900"},
          "Null" : {"NULL" : true},
          "EmptyList" : emptyListAV,
          "NonEmptyList" : nonEmptyListAV,
          "EmptyMap" : {"M" : {}},
          "BoolFalse" : boolAV
        }
      }
      await AWSDynamoDB.PutItem(PutItemRequest);
      var GetItemRequest = {
        "TableName" : hashTableName,
        "Key" : {"Id":{"N":"1"}}
      }
      var item = await AWSDynamoDB.GetItem(GetItemRequest);
      item = item.Item;
      if(JSON.stringify(item["EmptyList"].L) !== JSON.stringify([])){
        console.error("EmptyList is not []. EmptyList: " + JSON.stringify(item["EmptyList"].L));
        shouldResolve = false;
        return shouldResolve;
      }
      if(item["EmptyList"].M){
        console.error("EmptyList has M set. EmptyList: " + JSON.stringify(item["EmptyList"].M));
        shouldResolve = false;
        return shouldResolve;
      }
      if(JSON.stringify(item["EmptyMap"].M) !== JSON.stringify({})){
        console.error("EmptyMap is not {}. EmptyMap: " + JSON.stringify(item["EmptyMap"].M));
        shouldResolve = false;
        return shouldResolve;
      }
      if(item["EmptyMap"].L){
        console.error("EmptyMap has L set. EmptyMap: " + JSON.stringify(item["EmptyMap"].L));
        shouldResolve = false;
        return shouldResolve;
      }
      if(Object.keys(item["BoolFalse"]).indexOf("BOOL") === -1){
        console.error("BoolFalse doesn't have BOOL set " + JSON.stringify(item["BoolFalse"]));
        shouldResolve = false;
        return shouldResolve;
      }
      if(item["BoolFalse"].BOOL){
        console.error("BoolFalse is not false. BoolFalse: " + JSON.stringify(item["BoolFalse"].BOOL));
        shouldResolve = false;
        return shouldResolve;
      }
      //get nonexistent item
      var GetItemRequestNonExistent = {
        "TableName" : hashTableName,
        "Key" : {"Id":{"N":"999"}}
      }
      item = await AWSDynamoDB.GetItem(GetItemRequestNonExistent);
      if(item.Item){
        console.error("Item is set and it should not be: " + JSON.stringify(item));
        shouldResolve = false;
        return shouldResolve;
      }
      //get empty item
      GetItemRequest.ProjectionExpression = "Coffee";
      item = await AWSDynamoDB.GetItem(GetItemRequest);
      if(Object.keys(item.Item).length !== 0){
        console.error("Item has keys set and it should not be: " + JSON.stringify(item));
        shouldResolve = false;
        return shouldResolve;
      }
      //update item
      var UpdateItemRequest = {
        "TableName" : hashTableName,
        "Key" : {"Id":{"N":"1"}},
        "AttributeUpdates" : {
          "Product" : {"Action" : "PUT", "Value" : {"S" : "CloudSpotter 2.0"}},
          "Seller" : {"Action" : "DELETE"},
          "Tags" : {"Action" : "ADD", "Value" : {"SS" : ["2.0"]}}
        }
      }
      await AWSDynamoDB.UpdateItem(UpdateItemRequest);
      delete GetItemRequest["ProjectionExpression"];
      item = await AWSDynamoDB.GetItem(GetItemRequest);
      item = item.Item;
      if(!item.Product.S.includes("2.0")){
        console.error("Product did not get updated with 2.0 " + JSON.stringify(item));
        shouldResolve = false;
        return shouldResolve;
      }
      if(item.Tags.SS.length !== 3){
        console.error("Tags did not become 3 in length" + JSON.stringify(item));
        shouldResolve = false;
        return shouldResolve;
      }
      if(item.Seller){
        console.error("Seller did not get deleted" + JSON.stringify(item));
        shouldResolve = false;
        return shouldResolve;
      }
      var ScanRequest = {
        "TableName" : hashTableName,
        "FilterExpression" : "Company >= :val",
        "ExpressionAttributeValues" : {":val" : {"S":"Cloud"}}
      }
      item = await AWSDynamoDB.Scan(ScanRequest);
      if(item.Items.length !== 1 ){
        console.error("Scan did not return 1 item" + JSON.stringify(item));
        shouldResolve = false;
        return shouldResolve;
      }
      //update non-existent item
      var updateNonExistent = {
        "TableName" : hashTableName,
        "Key" : {"Id" : {"N" : "2"}},
        "AttributeUpdates" : {
          "Product" : {"Action" : "PUT", "Value" : {"S" : "CloudDebugger"}},
          "Company" : {"Action" : "PUT", "Value" : {"S" : "CloudsAreGrate"}},
          "Tags" : {"Action" : "PUT", "Value" : {"SS" : ["Test"]}},
          "Price" : {"Action" : "PUT", "Value" : {"N" : "42"}}
        }
      }
      await AWSDynamoDB.UpdateItem(updateNonExistent);
      GetItemRequest.Key = {"Id" : {"N" : "2"}};
      item = await AWSDynamoDB.GetItem(GetItemRequest);
      item = item.Item;
      if (!item.Product.S.includes("Debugger")){
        console.error("update new item did not change CloudDebugger" + JSON.stringify(item));
        shouldResolve = false;
        return shouldResolve;
      }
      if(item.Tags.SS.length !== 1){
        console.error("update new item did not change Tags" + JSON.stringify(item));
        shouldResolve = false;
        return shouldResolve;
      }
      if(Object.keys(item).indexOf("Seller") !== -1){
        console.error("update new item added Seller when it shouldn't have" + JSON.stringify(item));
        shouldResolve = false;
        return shouldResolve;
      }
      item = await AWSDynamoDB.Scan(ScanRequest);
      if(item.Items.length !== 2){
        console.error("items from scan are not equal to 2" + JSON.stringify(item));
        shouldResolve = false;
        return shouldResolve;
      }
      //Query global index
      var queryRequest = {
        "TableName" : hashTableName,
        "IndexName" : "GlobalIndex",
        "KeyConditionExpression": "Company = :PartitionKeyVal AND Price > :RangeKeyVal",
        "ExpressionAttributeValues" : {":PartitionKeyVal" : {"S":"CloudsAreGrate"},":RangeKeyVal" : {"N":"50"}}
      }
      item = await AWSDynamoDB.Query(queryRequest);
      if(item.Items.length !== 1){
        console.error("items from query with GlobalIndex are not equal to 1" + JSON.stringify(item));
        shouldResolve = false;
        return shouldResolve;
      }

      // Scan global index
      var scanRequest = {
        "TableName" : hashTableName,
        "IndexName" : "GlobalIndex",
        "FilterExpression": "Company = :PartitionKeyVal AND Price > :RangeKeyVal",
        "ExpressionAttributeValues" : {":PartitionKeyVal" : {"S":"CloudsAreGrate"},":RangeKeyVal" : {"N":"50"}}
      }
      item = await AWSDynamoDB.Scan(scanRequest);
      if(item.Items.length !== 1){
        console.error("items from scan with GlobalIndex are not equal to 1" + JSON.stringify(item));
        shouldResolve = false;
        return shouldResolve;
      }
      shouldResolve = true;
      return shouldResolve;
    }catch(e){
      var DeleteTableRequest = {
        "TableName" : hashTableName
      }
      await AWSDynamoDB.DeleteTable(DeleteTableRequest);
      await this.WaitForTableStatus([hashTableName],"DELETED");
      console.error(e);
      shouldResolve = false;
      return shouldResolve;
    }
  }

  async TestHashRangeTable() : Promise<any> {
    try{
      await this.Setup();
      var CreateTableRequest= {
        "TableName" : hashRangeTableName,
        "AttributeDefinitions" : [
          {"AttributeName" : "Name", "AttributeType" : "S"},
          {"AttributeName" : "Age", "AttributeType" : "N"},
          {"AttributeName" : "Company", "AttributeType" : "S"},
          {"AttributeName" : "Score", "AttributeType" : "N"},
          {"AttributeName" : "Manager", "AttributeType" : "S"}
        ],
        "KeySchema" : [
          {"KeyType" : "HASH", "AttributeName" : "Name"},
          {"KeyType" : "RANGE", "AttributeName" : "Age"}
        ],
        "GlobalSecondaryIndexes" : [{
          "IndexName" : "GlobalIndex",
          "KeySchema" : [
            {"AttributeName":"Company","KeyType":"HASH"},
            {"AttributeName":"Score","KeyType":"RANGE"}
          ],
          "ProvisionedThroughput" : {"ReadCapacityUnits":1,"WriteCapacityUnits":1},
          "Projection" : {"ProjectionType":"ALL"}
        }],
        "LocalSecondaryIndexes":[{
          "IndexName" : "LocalIndex",
          "KeySchema" : [
            {"KeyType" : "HASH", "AttributeName" : "Name"},
            {"KeyType" : "RANGE", "AttributeName" : "Manager"},
          ],
          "Projection" : {
            "ProjectionType" : "INCLUDE",
            "NonKeyAttributes" : ["Company","Score"]
          }
        }],
        "ProvisionedThroughput":{"ReadCapacityUnits":5,"WriteCapacityUnits":5}
      }
      await AWSDynamoDB.CreateTable(CreateTableRequest);
      await this.WaitForTableStatus([hashRangeTableName],"ACTIVE");

      var PutItemRequest = {
        "TableName" : hashRangeTableName,
        "Item" : {
          "Name" : {"S" : "Alan"},
          "Age" : {"N" : "31"},
          "Company" : {"S" : "Big River"},
          "Score" : {"N" : "120"},
          "Manager" : {"S" : "Barbara"}
        }
      }
      await AWSDynamoDB.PutItem(PutItemRequest);
      PutItemRequest = {
        "TableName" : hashRangeTableName,
        "Item" : {
          "Name" : {"S" : "Chuck"},
          "Age" : {"N" : "30"},
          "Company" : {"S" : "Big River"},
          "Score" : {"N" : "94"},
          "Manager" : {"S" : "Barbara"}
        }
      }
      await AWSDynamoDB.PutItem(PutItemRequest);
      PutItemRequest = {
        "TableName" : hashRangeTableName,
        "Item" : {
          "Name" : {"S" : "Diane"},
          "Age" : {"N" : "40"},
          "Company" : {"S" : "Madeira"},
          "Score" : {"N" : "140"},
          "Manager" : {"S" : "Eva"}
        }
      }
      await AWSDynamoDB.PutItem(PutItemRequest);
      PutItemRequest = {
        "TableName" : hashRangeTableName,
        "Item" : {
          "Name" : {"S" : "Diane"},
          "Age" : {"N" : "24"},
          "Company" : {"S" : "Madeira"},
          "Score" : {"N" : "101"},
          "Manager" : {"S" : "Francis"}
        }
      }
      await AWSDynamoDB.PutItem(PutItemRequest);
      var scanRequest = {
        "TableName" : hashRangeTableName,
        "FilterExpression": "Company >= :PartitionKeyVal",
        "ExpressionAttributeValues" : {":PartitionKeyVal" : {"S":"Big"}}
      }
      var item = await AWSDynamoDB.Scan(scanRequest);
      if(item.Items.length !== 4){
        console.error("Items does not have 4 elements: " + JSON.stringify(item));
        shouldResolve = false;
        return shouldResolve;
      }
      // Query table with no range-key condition
      var queryRequest = {
        "TableName" : hashRangeTableName,
        "KeyConditions" : {"Name" : {"ComparisonOperator":"EQ","AttributeValueList":[{"S":"Diane"}]}}
      }
      item = await AWSDynamoDB.Query(queryRequest);
      if(item.Items.length !== 2){
        console.error("Items does not have 2 elements: " + JSON.stringify(item));
        shouldResolve = false;
        return shouldResolve;
      }
      queryRequest.ProjectionExpression = "Coffee";
      item = await AWSDynamoDB.Query(queryRequest);
      if(item.Items.length !== 2){
        console.error("Items does not have 2 elements: " + JSON.stringify(item));
        shouldResolve = false;
        return shouldResolve;
      }
      if(Object.keys(item.Items[0]).length !== 0){
        console.error("An item at index 0 has keys that it should not have " + JSON.stringify(item));
        shouldResolve = false;
        return shouldResolve;
      }
      if(Object.keys(item.Items[1]).length !== 0){
        console.error("An item at index 1 has keys that it should not have " + JSON.stringify(item));
        shouldResolve = false;
        return shouldResolve;
      }

      //Query table with hash-key condition expression
      queryRequest = {
        "TableName" : hashRangeTableName,
        "KeyConditionExpression": "#PartitonKey = :PartitionKeyVal",
        "ExpressionAttributeValues" : {":PartitionKeyVal" : {"S":"Diane"}},
        "ExpressionAttributeNames" : {"#PartitonKey" : "Name"}
      }
      item = await AWSDynamoDB.Query(queryRequest);
      if(item.Items.length !== 2){
        console.error("Items does not have 2 elements: " + JSON.stringify(item));
        shouldResolve = false;
        return shouldResolve;
      }

      queryRequest = {
        "TableName" : hashRangeTableName,
        "KeyConditionExpression": "#PartitonKey = :PartitionKeyVal AND #RangeKey > :RangeKeyVal",
        "ExpressionAttributeValues" : {":PartitionKeyVal" : {"S":"Diane"}, ":RangeKeyVal" : {"N" : "30"}},
        "ExpressionAttributeNames" : {"#PartitonKey" : "Name", "#RangeKey" : "Age"}
      }
      item = await AWSDynamoDB.Query(queryRequest);
      if(item.Items.length !== 1){
        console.error("Items does not have 1 elements: " + JSON.stringify(item));
        shouldResolve = false;
        return shouldResolve;
      }

      queryRequest = {
        "TableName" : hashRangeTableName,
        "IndexName" : "GlobalIndex",
        "KeyConditions" : {"Company" : {"ComparisonOperator":"EQ","AttributeValueList":[{"S":"Big River"}]},"Score":{"ComparisonOperator":"GT","AttributeValueList":[{"N":"100"}]}}
      }
      item = await AWSDynamoDB.Query(queryRequest);
      if(item.Items.length !== 1){
        console.error("Items does not have 1 elements: " + JSON.stringify(item));
        shouldResolve = false;
        return shouldResolve;
      }

      queryRequest = {
        "TableName" : hashRangeTableName,
        "IndexName" : "LocalIndex",
        "KeyConditions" : {"Name" : {"ComparisonOperator":"EQ","AttributeValueList":[{"S":"Diane"}]},"Manager":{"ComparisonOperator":"EQ","AttributeValueList":[{"S":"Francis"}]}}
      }
      item = await AWSDynamoDB.Query(queryRequest);
      if(item.Items.length !== 1){
        console.error("Items does not have 1 elements: " + JSON.stringify(item));
        shouldResolve = false;
        return shouldResolve;
      }

      queryRequest = {
        "TableName" : hashRangeTableName,
        "IndexName" : "LocalIndex",
        "KeyConditions" : {"Name" : {"ComparisonOperator":"EQ","AttributeValueList":[{"S":"Diane"}]}},
        "QueryFilter" : {"Score":{"ComparisonOperator":"GT","AttributeValueList":[{"N":"120"}]}}
      }
      item = await AWSDynamoDB.Query(queryRequest);
      if(item.Items.length !== 1){
        console.error("Items does not have 1 elements: " + JSON.stringify(item));
        shouldResolve = false;
        return shouldResolve;
      }

      scanRequest = {
        "TableName" : hashRangeTableName,
        "IndexName" : "GlobalIndex",
        "FilterExpression": "Company = :PartitionKeyVal AND Score > :RangeKeyVal",
        "ExpressionAttributeValues" : {":PartitionKeyVal" : {"S":"Big River"},":RangeKeyVal" : {"N" : "100"}}
      }
      item = await AWSDynamoDB.Scan(scanRequest);
      if(item.Items.length !== 1){
        console.error("Items does not have 1 elements: " + JSON.stringify(item));
        shouldResolve = false;
        return shouldResolve;
      }

      //Scan local index with no range-key condition
      scanRequest = {
        "TableName" : hashRangeTableName,
        "IndexName" : "LocalIndex",
        "FilterExpression": "#PartitionKey = :PartitionKeyVal",
        "ExpressionAttributeValues" : {":PartitionKeyVal" : {"S":"Diane"}},
        "ExpressionAttributeNames" : {"#PartitionKey":"Name"}
      }
      item = await AWSDynamoDB.Scan(scanRequest);
      if(item.Items.length !== 2){
        console.error("Items does not have 2 elements: " + JSON.stringify(item));
        shouldResolve = false;
        return shouldResolve;
      }

      // Scan local index with range-key condition
      scanRequest = {
        "TableName" : hashRangeTableName,
        "IndexName" : "LocalIndex",
        "FilterExpression": "#PartitionKey = :PartitionKeyVal AND Manager = :RangeKeyVal",
        "ExpressionAttributeValues" : {":PartitionKeyVal" : {"S":"Diane"},":RangeKeyVal" : {"S":"Francis"}},
        "ExpressionAttributeNames" : {"#PartitionKey":"Name"}
      }
      item = await AWSDynamoDB.Scan(scanRequest);
      if(item.Items.length !== 1){
        console.error("Items does not have 1 elements: " + JSON.stringify(item));
        shouldResolve = false;
        return shouldResolve;
      }

      // Scan local index with a non-key condition
      scanRequest = {
        "TableName" : hashRangeTableName,
        "IndexName" : "LocalIndex",
        "FilterExpression": "#PartitionKey = :PartitionKeyVal AND Score > :RangeKeyVal",
        "ExpressionAttributeValues" : {":PartitionKeyVal" : {"S":"Diane"},":RangeKeyVal" : {"N":"120"}},
        "ExpressionAttributeNames" : {"#PartitionKey":"Name"}
      }
      item = await AWSDynamoDB.Scan(scanRequest);
      if(item.Items.length !== 1){
        console.error("Items does not have 2 elements: " + JSON.stringify(item));
        shouldResolve = false;
        return shouldResolve;
      }
      shouldResolve = true;
      return shouldResolve;
    }catch(e){
      var DeleteTableRequest = {
        "TableName" : hashRangeTableName
      }
      await AWSDynamoDB.DeleteTable(DeleteTableRequest);
      await this.WaitForTableStatus([hashRangeTableName],"DELETED");
      console.error(e);
      shouldResolve = false;
      return shouldResolve;
    }
  }

  async TestBatchWriteGet() : Promise<any> {
    try{
      await this.Setup();
      var BatchWriteRequest = {"RequestItems":{}};
      BatchWriteRequest.RequestItems[hashTableName] = [{
        "PutRequest": {
          "Item": {
            "Id": {
              "N": "6"
            },
            "Product": {
              "S": "CloudVerifier"
            },
            "Company": {
              "S": "CloudsAreGrate"
            }
          }
        }
      }, {
        "DeleteRequest": {
          "Key": {
            "Id": {
              "N": "2"
            }
          }
        }
      }]
      BatchWriteRequest.RequestItems[hashRangeTableName] = [{
        "DeleteRequest": {
          "Key": {
            "Name": {
              "S": "Diane"
            },
            "Age": {
              "N": "24"
            }
          }
        }
      }];
      await AWSDynamoDB.BatchWriteItem(BatchWriteRequest);
      var BatchGetRequest = {"RequestItems":{}};
      BatchGetRequest.RequestItems[hashTableName] = {
        "Keys" : [
          {"Id" : {"N" : "1"}},
          {"Id" : {"N" : "6"}}
        ]
      }
      BatchGetRequest.RequestItems[hashRangeTableName] = {
        "Keys" : [
          {
            "Name" : {"S" : "Alan"},
            "Age" : {"N" : "31"}
          },
          {
            "Name" : {"S" : "Chuck"},
            "Age" : {"N" : "30"}
          },
          {
            "Name" : {"S" : "Diane"},
            "Age" : {"N" : "40"}
          }
        ]
      }
      var items = await AWSDynamoDB.BatchGetItem(BatchGetRequest);

      var hashTable = items.Responses[hashTableName];
      if(hashTable.length !== 2){
        console.error("hash table batch get did not return 2 elements: " +  JSON.stringify(items));
        shouldResolve = false;
        return shouldResolve;
      }
      var hashRangeTable = items.Responses[hashRangeTableName];
      if(hashRangeTable.length !== 3){
        console.error("hash range table batch get did not return 3 elements: " +  JSON.stringify(items));
        shouldResolve = false;
        return shouldResolve;
      }
      shouldResolve = true;
      return shouldResolve;
    }catch(e){
      console.error(e);
      shouldResolve = false;
      return shouldResolve;
    }
  }

  async WriteBigBatch(items, index, itemsize) : Promise <any> {
    try{
      var itemids = [];
      var itemData = "@" + itemsize;
      var writeRequests = [];
      var i;
      for (i = 0; i < items; i++){
        var itemID = index.toString() + i;
        itemids.push(itemID);
        var writeRequest = {
          "PutRequest": {
            "Item": {
              "Id": {
                "N": itemID
              },
              "Data": {
                "S": itemData
              }
            }
          }
        }
        writeRequests.push(writeRequest)
      }
      var result;
      var request = {"RequestItems":{}};
      request.RequestItems[hashTableName] = writeRequests;
      do{
        var result = await AWSDynamoDB.BatchWriteItem(request);
        request.RequestItems = result.UnprocessedItems;
      }while(Object.keys(request.RequestItems).length !== 0);
      return itemids;
    }catch(e){
      console.error(e);
      shouldResolve = false;
      return shouldResolve;
    }
  }

  async GetBigBatch(idsToGet) : Promise <any>{
    try{
      var keys = [];
      var i;
      for (i = 0; i < idsToGet.length ; i++){
        keys.push(
        {"Id" : {"N":idsToGet[i].toString()}}
        );
      }

      var BatchGetRequest = {"RequestItems":{}};
      BatchGetRequest.RequestItems[hashTableName] = {"Keys" : keys}

      var itemsRetrieved = 0;

      do {
        var result = await AWSDynamoDB.BatchGetItem(BatchGetRequest);
        itemsRetrieved += result.Responses[hashTableName].length;
        BatchGetRequest.RequestItems = result.UnprocessedKeys;
      } while(Object.keys(BatchGetRequest.RequestItems).length !== 0);
      return itemsRetrieved;
    }catch(e){
      console.error(e);
      shouldResolve = false;
      return e;
    }
  }

  async TestLargeBatches() : Promise <any> {
    try{
      await this.Setup();
      var itemSize = 60 * 1024;
      var MaxItemSize = 65 * 1024;
      if(itemSize >= MaxItemSize){
        console.error("Item size is too large: " + itemSize);
        shouldResolve = false;
        return shouldResolve;
      }
      var itemCount = 25;
      var OneMB = 1024 * 1024;
      var MaxBatchSize = 25;
      var writeBatchSize = Math.floor(OneMB*1.0/itemSize);
      var itemIds = [];
      var i;
      for (i = 0; i < itemCount; i += writeBatchSize){
        var writtenIds = await this.WriteBigBatch(writeBatchSize, i, itemSize);
        itemIds = itemIds.concat(writtenIds);
      }
      for (i = 0; i < itemCount; i += MaxBatchSize){
        var endIndex = i+MaxBatchSize;
        if(endIndex > itemIds.length){
          endIndex = itemIds.length;
        }
        var itemsToGet = itemIds.slice(i,endIndex);
        if(itemsToGet.length > 0){
          var itemsRetrieved = await this.GetBigBatch(itemsToGet);
          if(itemsRetrieved !== itemsToGet.length){
            console.error("Items retrieved was not matched: " + itemsRetrieved);
            shouldResolve = false;
            return shouldResolve;
          }
        }
      }

      shouldResolve = true;
      var DeleteTableRequest = {
        "TableName" : hashRangeTableName
      }
      await AWSDynamoDB.DeleteTable(DeleteTableRequest);
      var DeleteTableRequest = {
        "TableName" : hashTableName
      }
      await AWSDynamoDB.DeleteTable(DeleteTableRequest);
      await this.WaitForTableStatus([hashRangeTableName,hashTableName],"DELETED");
      return shouldResolve;
    }catch(e){
      var DeleteTableRequest = {
        "TableName" : hashRangeTableName
      }
      await AWSDynamoDB.DeleteTable(DeleteTableRequest);

      var DeleteTableRequest = {
        "TableName" : hashTableName
      }
      await AWSDynamoDB.DeleteTable(DeleteTableRequest);
      await this.WaitForTableStatus([hashRangeTableName,hashTableName],"DELETED");

    }
  }


}
