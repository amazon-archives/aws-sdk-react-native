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

'use strict';
var React = require('react');
var ReactNative = require('react-native');
var TransferUtility = require('./app/TransferUtility');
var styles = ReactNative.StyleSheet.create({
  container: {
    flex: 1
  }
});

class example extends React.Component {
  _renderScene(route, navigator) {
    if (route.id === 1) {
      return <TransferUtility navigator={navigator} />
    }
  }
  render() {
    return (
      <ReactNative.Navigator
        initialRoute={{id: 1}}
        renderScene={this._renderScene}
        />
    );
  }
}

ReactNative.AppRegistry.registerComponent('example', function() { return example });
