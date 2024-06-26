import React from 'react';
import Navbar from '../components/NavBar';

function ContactMe() {
  return (
    <div className="container">
      <Navbar />
      <div className="introduction-container">
        <h1 className="introduction-title">Hello!</h1>
        <div className="introduction-content">
          <p>
    Have a question, a suggestion, or just want to share your love for all things delicious? Well, don't be shy! Reach out to me, Happy Bibimbap, and let's chat about the wonderful world of food, fun, and flavor!
    <br />
    <br />
    You can drop me an email at: <a href="mailto:happybibimbap@gmail.com">happybibimbap@gmail.com</a>
    <br />
    <br />
    Or, if you prefer a more traditional approach, you can send a letter to my whimsical headquarters:
    <br />
    <br />
    Happy Bibimbap's Palace of Scrumptious Delights
    <br />
    123 Flavor Street
    <br />
    Culinary Town, Tasteville 45678
    <br />
    <br />
    And for those who enjoy the fine art of social media, you can find me spreading joy and deliciousness on:
    <br />
    - Instagram: @happybibimbap_fun
    <br />
    - Twitter: @bibimbap_happy
    <br />
    - Facebook: Happy Bibimbap's Delightful Adventures
    <br />
    <br />
    Whether it's a recipe you need, a food fact you want to share, or just a bit of friendly banter, I'm here for it all. So go ahead, don't be a stranger – let's cook up some conversation and savor the delightful journey of culinary camaraderie!
    <br />
    <br />
    Yours in delightful dining,
    <br />
    Happy Bibimbap
</p>
        </div>
      </div>
    </div>
  );
}

export default ContactMe;