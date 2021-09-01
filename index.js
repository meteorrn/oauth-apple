import Meteor from '@meteorrn/core';
import appleAuth from '@invertase/react-native-apple-authentication';

Meteor.loginWithApple = async function(callback) {
	try {
		const appleAuthRequestResponse = await appleAuth.performRequest({
			requestedOperation: appleAuth.Operation.LOGIN,
			requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME]
		});
		if (!appleAuthRequestResponse.authorizationCode) {
			typeof callback == 'function' && callback('Apple Sign-In failed');
			return;
		}
		Meteor._startLoggingIn();
		Meteor.call(
			'login',
			{
				methodName: 'native-apple',
				code: appleAuthRequestResponse.authorizationCode,
				...appleAuthRequestResponse
			},
			(error, response) => {
				Meteor._endLoggingIn();
				Meteor._handleLoginCallback(error, response);
				typeof callback == 'function' && callback(error);
			}
		);
	} catch (error) {
		typeof callback == 'function' && callback(error);
	}
};
