//
// Copyright 2010-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
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

import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableHighlight, Navigator, ScrollView } from 'react-native';

import AWS from 'aws-sdk/dist/aws-sdk-react-native';

export default class Login extends Component{

    constructor(props){
        super(props);
        this.state = {
            accessKeyId : '',
            secretAccessKey: '',
            sessionToken: '',
            expiration: '',
            identityId: ''
        };
    }

    componentDidMount() {
        AWS.config.credentials.refresh((error) => {
            if (error) { console.log(error); }
            else {
                this.setState({
                    accessKeyId : AWS.config.credentials.accessKeyId,
                    secretAccessKey: AWS.config.credentials.secretAccessKey,
                    sessionToken: AWS.config.credentials.sessionToken,
                    expiration: AWS.config.credentials.data.Credentials.Expiration,
                    identityId: AWS.config.credentials.identityId
                })
                console.log('AccessKeyId: ' + AWS.config.credentials.accessKeyId);
                console.log('SecretKey: ' + AWS.config.credentials.secretAccessKey);
                console.log('SessionToken: ' + AWS.config.credentials.sessionToken);
                console.log('Expiration: ' + AWS.config.credentials.data.Credentials.Expiration);
                console.log('IdentityId: ' + AWS.config.credentials.identityId);
            }
        });
    }

    render(){
        return(
            <View>
                <Text style={{fontSize:20,fontWeight:'bold', padding:10}}>{this.props.title}</Text>
                <ScrollView style={{paddingVertical:20}}>
                    <Text style={{fontSize:15, padding:5}}>
                        AccessKeyId: 
                        { this.state.accessKeyId }
                    </Text>
                    
                    <Text style={{fontSize:15, padding:5}}>
>
                        SecretKey:
                        { this.state.secretAccessKey }
                    </Text>

                    <Text style={{fontSize:15, padding:5}}>
                        SessionToken: 
                        { this.state.sessionToken }
                    </Text>
                    
                    <Text style={{fontSize:15, padding:5}}>
>
                        Expiration:
                        { this.state.expiration.toString() }
                    </Text>

                    <Text style={{fontSize:15, padding:5}}>
                        IdentityId: 
                        { this.state.identityId }
                    </Text>
                </ScrollView>
                <TouchableHighlight onPress={()=>this.goback()}>
                    <Text style={{fontSize:10, fontWeight:'bold', padding:5}}>Tap me to go back</Text>
                </TouchableHighlight>
            </View>
        )
    }
    goback(){
        this.props.navigator.push({
        title: 'Home'
        })
    }
}
