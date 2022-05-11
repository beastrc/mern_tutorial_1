import React, { useState } from 'react'
import { constant, utils } from '../../shared/index';

import {
  CardElement,
  useStripe,
  useElements,
  Elements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js"


const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#333333",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      height: 45,
      fontSize: "14px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};


const CheckoutForm = ({priceId, history}) => {
	const stripe = useStripe()
  	const elements = useElements()

  	const [email, setEmail] = useState(null)
  	const [name, setName] = useState(null)
  	const [country, setCountry] = useState("US")
  	const [zipcode, setZipCode] = useState(null)
  	const [formErrors, setFormErrors] = useState({})

  	const checkvalidation = () => {
  		return true
  	}

  	const handleSubmit = async (event) => {
    	event.preventDefault()

    	if (!stripe || !elements || !checkvalidation()) return;

    	const cardElement = elements.getElement(CardElement);

    	const payload = await stripe.createPaymentMethod({
	      type: "card",
	      card: elements.getElement(CardNumberElement),
	      billing_details: { 
	      	email: email,
	      	name: name,
	      	address: {
	      		country: country,
	      		postal_code: zipcode
	      	} 
	      },
	    })

	    if (payload.error) {
	    	utils.flashMsg('show', payload.error.message)
	    } else {
	    	const paymentMethodId = payload.paymentMethod.id

	    	utils.apiCall('CREATE_SUBSCRIPTION', {'data': { email, paymentMethodId, priceId }}, function(err, response) {
		      if (err) {
		        utils.flashMsg('show', 'Error while getting Dropdown Data');
		        utils.logger('error', 'Get All List Error -->', err);
		      } else {
		        if(response.status === 200)
		        	history.push(constant['ROUTES_PATH']['SUBSCRIPTIONS'])
		      }
		    })
	    }
   	}

	return (
		<form onSubmit={handleSubmit} className="stripe-form text-left" style={{padding: 30}}>
	      <div className="row">
	        <div className="col-lg-12">
	          <div className="form-group w-100" name="card_num">
	            <div className="text-white" style={{marginBottom: 10}}>Email Address</div>
	            <input
	              type="email"
	              style={{width: '100%'}}
	              required
	              onChange={(e) => setEmail(e.target.value)}
	            />
	            <p><span>{formErrors.email?formErrors.email:''}</span></p>
	          </div>
	        </div>
	      </div>
	      <div className="row">
	        <div className="col-lg-12">
	          <div className="form-group w-100" name="card_num">
	            <div className="text-white">Card Number</div>
	            <CardNumberElement className="card-num-input" options={CARD_ELEMENT_OPTIONS}/>
	            <p><span>{formErrors.cardNumber?formErrors.cardNumber:''}</span></p>
	          </div>
	        </div>
	      </div>
	      <div className="row">
	        <div className="col-lg-6">
	          <div className="form-group" name="exp_date">
	            <div className="text-white">Expiry Date</div>
	            <CardExpiryElement className="exp-date-input" options={CARD_ELEMENT_OPTIONS}/>
	            <p><span>{formErrors.expire?formErrors.expire:''}</span></p>
	          </div>
	        </div>
	        <div className="col-lg-6">
	          <div className="form-group" name="cvc">
	            <div className="text-white">CVC</div>
	            <CardCvcElement className="card-cvc-input" options={CARD_ELEMENT_OPTIONS}/>
	            <p><span>{formErrors.cvc?formErrors.cvc:''}</span></p>
	          </div>
	        </div>
	      </div>
	      <div className="row">
	        <div className="col-lg-12">
	          <div className="form-group w-100" name="card_num">
	            <div className="text-white" style={{marginBottom: 10}}>Name on Card</div>
	            <input
	              type="text"
	              style={{width: '100%'}}
	              required
	              onChange={(e) => setName(e.target.value)}
	            />
	            <p><span>{formErrors.name?formErrors.name:''}</span></p>
	          </div>
	        </div>
	      </div>
	      <div className="row">
	        <div className="col-lg-6">
	          <div className="form-group w-100" name="card_num">
	            <div className="text-white" style={{marginBottom: 10}}>Country</div>
	            <select className="select-simple" style={{width: '100%'}} onChange={(e) => setCountry(e.target.value)}>
	            	<option vlaue="US">United States</option>
	            </select>
	          </div>
	        </div>
	        <div className="col-lg-6">
	          <div className="form-group w-100" name="card_num">
	            <div className="text-white" style={{marginBottom: 10}}>ZIP</div>
	            <input
	              type="text"
	              style={{width: '100%'}}
	              required
	              onChange={(e) => setZipCode(e.target.value)}
	            />
	          </div>
	        </div>
	      </div>
	      <button className="btn btn-primary">
            Subscribe
          </button>
	    </form>
	)

}


export default CheckoutForm