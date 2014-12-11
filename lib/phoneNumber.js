"use strict";
var Client = require("./client");
var PHONE_NUMBER_PATH = "phoneNumbers";

function PhoneNumber(){
}

/** Get information about one number */
PhoneNumber.get = function(client, id, callback){
  if(arguments.length === 2){
    callback = id;
    id = client;
    client = new Client();
  }
  client.makeRequest("get", client.concatUserPath(PHONE_NUMBER_PATH) + "/" +  id, function(err, item){
    if(err){
      return callback(err);
    }
    item.client = client;
    item.__proto__ = PhoneNumber.prototype;
    callback(null, item);
  });
};

/** Get a list of your numbers */
PhoneNumber.list = function(client, query, callback){
  if(arguments.length === 2){
    callback = query;
    if(client instanceof Client){
      query = {};
    }
    else{
      query = client;
      client = new Client();
    }
  }
  else if(arguments.length === 1){
    callback = client;
    client = new Client();
  }
  client.makeRequest("get", client.concatUserPath(PHONE_NUMBER_PATH), query, function(err, items){
    if(err){
      return callback(err);
    }
    items = items || [];
    var result = items.map(function(item){
      item.client = client;
      item.__proto__ = PhoneNumber.prototype;
      return item;
    });
    callback(null, result);
  });
};

/** Allocate a number so you can use it */
PhoneNumber.create = function(client, item, callback){
  if(arguments.length === 2){
    callback = item;
    item = client;
    client = new Client();
  }
  var request = client.createRequest("post", client.concatUserPath(PHONE_NUMBER_PATH));
  request.type("json").send(item).end(function(res){
    if(res.ok && res.headers.location){
      Client.getIdFromLocationHeader(res.headers.location, function(err, id){
        if(err){
          return callback(err);
        }
        PhoneNumber.get(client, id, callback);
      });
    }
    else{
      client.checkResponse(res, callback);
    }
  });
};

/** Make changes to a number you have  */
PhoneNumber.prototype.update = function(data, callback){
  this.client.makeRequest("post", this.client.concatUserPath(PHONE_NUMBER_PATH) + "/" + this.id,  data, callback);
};

/** Remove a number from your account */
PhoneNumber.prototype.delete = function(callback){
  this.client.makeRequest("del", this.client.concatUserPath(PHONE_NUMBER_PATH) + "/" + this.id, callback);
};

module.exports = PhoneNumber;