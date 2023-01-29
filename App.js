import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {StripeProvider} from '@stripe/stripe-react-native';
import PaymentScreen from './src/PaymentScreen';
const App = () => {
  const publishableKey =
    'your_key';
  return (
    <StripeProvider publishableKey={publishableKey}>
      <PaymentScreen />
    </StripeProvider>
  );
};
const styles = StyleSheet.create({});
export default App;
