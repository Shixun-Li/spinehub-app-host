import { useEffect, useState } from 'react';
import { Keyboard, Platform, EmitterSubscription, KeyboardEvent } from 'react-native';

const useKeyboardStatus = () => {
	const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

	const [keyboardHeight, setKeyboardHeight] = useState(0);

	useEffect(() => {
		function onKeyboardDidShow(e: KeyboardEvent) {
			// Remove type here if not using TypeScript
			setKeyboardHeight(e.endCoordinates.height);
		}

		function onKeyboardDidHide() {
			setKeyboardHeight(0);
		}

		const showSubscription = Keyboard.addListener('keyboardWillShow', onKeyboardDidShow);
		const changeSubscription = Keyboard.addListener('keyboardWillChangeFrame', onKeyboardDidShow);
		const hideSubscription = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
		return () => {
			showSubscription.remove();
			changeSubscription.remove();
			hideSubscription.remove();
		};
	}, []);

	useEffect(() => {
		const keyboardDidShowListener: EmitterSubscription = Keyboard.addListener(
			Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
			() => {
				setIsKeyboardOpen(true);
			},
		);

		const keyboardDidHideListener: EmitterSubscription = Keyboard.addListener(
			Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
			() => {
				setIsKeyboardOpen(false);
			},
		);

		// Cleanup event listeners when the component unmounts
		return () => {
			keyboardDidShowListener.remove();
			keyboardDidHideListener.remove();
		};
	}, []);

	return { isKeyboardOpen, keyboardHeight };
};

export default useKeyboardStatus;
