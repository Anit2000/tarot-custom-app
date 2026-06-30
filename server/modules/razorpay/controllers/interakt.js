import fetch from "node-fetch";

const createAbandonedCheckoutEventInInterakt = async (payload) => {
  try {
    const shop = "kh0z0z-1r.myshopify.com";
    const eventPayload = {
      event: "abandoned checkout",
      phoneNumber: payload.phone?.replace("+91", ""),
      countryCode: "+91",
      traits: {
        createdAt: payload.created_at,
        name: payload.customer?.first_name + payload.customer?.last_name,
        email: payload.email,
        total: Number(payload?.line_items_total || 0) / 100,
        "all products": payload.line_items.map(el => el.variant_title).join(","),
        "all variants": payload.line_items.map(el => el.variant_id).join(","),
        "abandonded checkout url": payload.abandoned_checkout_url
      },
    };
    if (!payload.phone) {
      throw new Error(
        "Failed to create interact event reason --> No phone number found in the payload"
      );
    }
    await registerCustomerInInterakt({firstName: payload.customer.first_name,lastName: payload.customer.last_name,phone: payload.phone,email: payload.email});
    const url = `https://api.interakt.ai/v1/public/track/events/`;
    const request = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${process.env.INTERAKT_SECRET_KEY}`,
      },
      body: JSON.stringify(eventPayload),
    });

    const res = await request.json();
    if(!res.result){
      throw new Error("Failed to create abandoned checkout event in interakt reason -->" + res.message)
    }
    console.log(eventPayload.phoneNumber + " abandonded checkout event created in interakt ✅");
  } catch (err) {
    throw new Error(
      "Failed to create abandoned checkout event in interakt reason -->" +
        err.message
    );
  }
};

const registerCustomerInInterakt = async ({
  firstName,
  lastName,
  phone,
  email,
}) => {
  try {
    const payload = {
      countryCode: "+91",
      phoneNumber: phone.replace("+91", ""),
      traits: {
        name: `${firstName} ${lastName}`,
        email: email,
        first_name: firstName,
        last_name: lastName,
      },
    };
    console.log(payload)
    const url = `https://api.interakt.ai/v1/public/track/users/`;
    const request = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${process.env.INTERAKT_SECRET_KEY}`,
      },
      body: JSON.stringify(payload),
    });
    const res = await request.json();
    if (!res.result) {
      throw new Error("Failed to register customer in interakt reason -->" + res.message);
    }
    return res;
  } catch (err) {
    throw new Error("Failed to handle customer registeration in interakt reason -->" + err.message);
  }
};
export { createAbandonedCheckoutEventInInterakt };
