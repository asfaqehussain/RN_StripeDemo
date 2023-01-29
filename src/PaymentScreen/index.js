import React, {useState, useEffect} from 'react';
import {StyleSheet, Button, View, Alert, Text} from 'react-native';
import {
  CardField,
  CardFieldInput,
  useStripe,
} from '@stripe/stripe-react-native';

export default PaymentScreen = () => {
  const [card, setCard] = useState(CardFieldInput.Details | null);
  const {confirmPayment, handleCardAction} = useStripe();

  // Replace localhost to your IP address if you get error
  const API_URL = 'http://localhost:8000';

  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const [loading, setLoading] = useState(false);

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(`${API_URL}/payment-sheet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('resp payment-sheet ---> ', response);
    const {paymentIntent, ephemeralKey, customer} = await response.json();

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const {paymentIntent, ephemeralKey, customer, publishableKey} =
      await fetchPaymentSheetParams();
    console.log('paymentIntent', paymentIntent);

    const {error} = await initPaymentSheet({
      merchantDisplayName: 'Example, Inc.',
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: 'Jane Doe',
      },
    });
    if (!error) {
      setLoading(true);
    }
  };
  const openPaymentSheet = async () => {
    const {error, token} = await presentPaymentSheet();
    console.log('error>>>', error);
    console.log('token>>>', token);
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert(
        'Success',
        'Your order is confirmed & Restart app if you have to create new payment',
      );
    }
  };
  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <View style={styles.container}>
      {/* <CardField
        postalCodeEnabled={false}
        placeholder={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={{
          backgroundColor: '#FFFFFF',
          textColor: '#000000',
        }}
        style={{
          width: '100%',
          height: 50,
          marginVertical: 30,
        }}
        onCardChange={(cardDetails) => {
          setCard(cardDetails);
        }}
        onFocus={(focusedField) => {
          console.log('focusField', focusedField);
        }}
      /> */}
      <Text
        style={{
          fontSize: 32,
          textAlign: 'center',
          margin: 20,
        }}>
        Payment Page
      </Text>
      <Text
        style={{
          fontSize: 15,
          textAlign: 'center',
          margin: 40,
        }}>
        Payment with stripe demo
      </Text>
      <Button
        style={styles.button}
        disabled={!loading}
        title="Pay Now"
        color="#841584"
        onPress={openPaymentSheet}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginHorizontal: 10,
    marginVertical: 10,
    //  alignItems:'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#00aeef',
    borderColor: 'red',
    borderWidth: 5,
    borderRadius: 5,
  },
});
