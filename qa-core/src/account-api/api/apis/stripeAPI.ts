import AccountInternalAPIClient from "../AccountInternalAPIClient"
import BaseAPI from "./BaseAPI"
import { APIRequestOpts } from "../../../types"

export default class StripeAPI extends BaseAPI {
    client: AccountInternalAPIClient

    constructor(client: AccountInternalAPIClient) {
        super()
        this.client = client
    }

    async createCheckoutSession(
        priceId: string,
        opts: APIRequestOpts = { status: 200 }
    ) {
        return this.doRequest(() => {
            return this.client.post(`/api/stripe/checkout-session`, {
                body: { priceId },
            })
        }, opts)
    }

    async createCheckoutSuccess(
        opts: APIRequestOpts = { status: 200 }
    ) {
        return this.doRequest(() => {
            return this.client.post(`/api/stripe/checkout-success`)
        }, opts)
    }

    async createPortalSession(
        stripeCustomerId: string,
        opts: APIRequestOpts = { status: 200 }
    ) {
        return this.doRequest(() => {
            return this.client.post(`/api/stripe/portal-session`, {
                body: { stripeCustomerId },
            })
        }, opts)
    }

    async createLink(
        opts: APIRequestOpts = { status: 200 }
    ) {
        return this.doRequest(() => {
            return this.client.post(`/api/stripe/link`)
        }, opts)
    }

    async getInvoices(opts: APIRequestOpts = { status: 200 }) {
        return this.doRequest(() => {
            return this.client.get(`/api/stripe/invoices`)
        }, opts)
    }

    async getUpcomingInvoice(opts: APIRequestOpts = { status: 200 }) {
        return this.doRequest(() => {
            return this.client.get(`/api/stripe/upcoming-invoice`)
        }, opts)
    }

    async getStripeCustomers(opts: APIRequestOpts = { status: 200 }) {
        return this.doRequest(() => {
            return this.client.get(`/api/stripe/customers`)
        }, opts)
    }
}
