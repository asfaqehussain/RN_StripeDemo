require('dotenv').config();
const express = require('express');
const app = express();
const {resolve} = require('path');
const stripe = require('stripe')(process.env.secret_key); // https://stripe.com/docs/keys#obtain-api-keys
app.use(express.static('.'));
app.use(express.json());

app.post('/payment-sheet', async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2022-11-15'},
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 100099,
    currency: 'INR',
    customer: customer.id,
    // payment_method_types: [ 'card', 'ideal', 'klarna', 'sepa_debit', 'sofort'],
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: 'your_key',
  });
});

app.listen(process.env, () => {
  console.log(`Node server listening on port ${process.env.PORT}!`);
  // console.log(`Node server listening on port ${process.env.TZ}!`)
});
