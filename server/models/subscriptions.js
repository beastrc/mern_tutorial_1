var rfr = require('rfr'),
  request = require('request'),
  mongoose = require('mongoose'),
  ObjectId = mongoose.Types.ObjectId,
  users = mongoose.model('users'),
  subscriptions = mongoose.model('subscriptions');

var nTermsModel = rfr('/server/models/negotiateTerms'),
  jobStatusModel = rfr('/server/models/jobStatus'),
  profileModel = rfr('/server/models/users/profile');

var helper = rfr('/server/models/shared/helper'),
  config = rfr('/server/shared/config'),
  constant = rfr('/server/shared/constant'),
  logger = rfr('/server/shared/logger'),
  mailHelper = rfr('/server/shared/mailHelper'),
  utils = rfr('/server/shared/utils');

var stripe = require("stripe")(config['stripe']['secret_key']);


// Create Checkout Sessoin
async function createCheckoutSession(req, res, cb) {
  const domainURL = config['stripe']['redirect_url'];
  const { price_id } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],

      success_url: `${domainURL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domainURL}/canceled.html`,
    });

    res.send({
      sessionId: session.id,
    });
  } catch (e) {
    res.status(400);
    return res.send({
      error: {
        message: e.message,
      }
    });
  }
}


// Get Subscribed Plan
function getSubscribedPlan(req, res, cb) {
  if (req.headers.token) {
    helper.checkUserLoggedIn(req.headers.token, async function (err, result) {
      if (err) {
        cb({ Code: 401, Status: false, Message: err });
      } else {
        const userId = result._id;
        const subscription = await subscriptions.findOne({ user_id: userId, status: 'active' })
        res.json({
          plan: subscription
        })
      }
    })
  } else {
    cb({ Code: 400, Status: false, Message: constant['AUTH_FAIL'] });
  }
}


// Create Subscription 
async function createSubscription(req, res, cb) {
  if (req.headers.token) {
    helper.checkUserLoggedIn(req.headers.token, async function (err, result) {
      if (err) {
        cb({ Code: 401, Status: false, Message: err });
      } else {
        const userId = result._id;
        let subscribed_plan = await subscriptions.findOne({ user_id: userId, status: 'active' })

        if (subscribed_plan) {
          res.json({
            plan: subscribed_plan
          })
        } else {
          const { email, paymentMethodId, priceId } = req.body;

          try {
            const customer = await stripe.customers.create({
              email: email
            });

            // Attach the payment method to the customer
            try {
              await stripe.paymentMethods.attach(paymentMethodId, {
                customer: customer.id,
              });
            } catch (error) {
              return res.status('402').send({ error: { message: error.message } });
            }

            // Change the default invoice settings on the customer to the new payment method
            await stripe.customers.update(
              customer.id,
              {
                invoice_settings: {
                  default_payment_method: paymentMethodId,
                },
              }
            );

            // Create the subscription
            const subscriptionRes = await stripe.subscriptions.create({
              customer: customer.id,
              items: [{ price: priceId }]
            });

            // Save Subscription to DB
            const newSubscription = new subscriptions({
              user_id: userId,
              subscription_type: 1,
              projects: [],
              subscription_id: subscriptionRes.id,
              signup_at: subscriptionRes.created,
              plan_id: subscriptionRes.plan.id,
              status: subscriptionRes.status,
              renewed_at: subscriptionRes.current_period_end
            })

            subscribed_plan = await newSubscription.save()
            res.json({
              plan: subscribed_plan
            })

          } catch (e) {
            res.status(400);
            return res.send({
              error: {
                message: e.message,
              }
            });
          }
        }
      }
    });
  } else {
    cb({ Code: 400, Status: false, Message: constant['AUTH_FAIL'] });
  }
}

// Cancel Subscription
async function cancelSubscription(req, res, cb) {
  if (req.headers.token) {
    helper.checkUserLoggedIn(req.headers.token, async function (err, result) {
      if (err) {
        cb({ Code: 401, Status: false, Message: err });
      } else {
        const userId = result._id;

        let subscribed_plan = await subscriptions.findOne({ user_id: userId, status: 'active' })

        if (subscribed_plan) {
          try {
            const deletedSubscription = await stripe.subscriptions.del(
              subscribed_plan.subscription_id
            );

            subscribed_plan.status = deletedSubscription.status
            subscribed_plan.canceled_at = deletedSubscription.canceled_at
            subscribed_plan.canceled_reason = req.body.message

            await subscribed_plan.save()

            res.json({
              plan: null
            })
          } catch (e) {
            res.status(400);
            return res.send({
              error: {
                message: e.message,
              }
            });
          }
        }
      }
    });
  } else {
    cb({ Code: 400, Status: false, Message: constant['AUTH_FAIL'] });
  }
}


module.exports = {
  getSubscribedPlan,
  createCheckoutSession,
  createSubscription,
  cancelSubscription
}
