export interface OrderResponseDto {
    id: string;
    created_at: string;
    finalized_at: any;
    amount_in_cents: number;
    reference: string;
    customer_email: string;
    currency: string;
    payment_method_type: string;
    payment_method: {
        type: string;
        extra: {
            bin: string;
            name: string;
            brand: string;
            exp_year: string;
            card_type: string;
            exp_month: string;
            last_four: string;
            card_holder: string;
            is_three_ds: boolean;
            three_ds_auth_type: any;
        };
        installments: number;
    };
    status: string;
    status_message: any;
    billing_data: any;
    shipping_address: any;
    redirect_url: any;
    payment_source_id: any;
    payment_link_id: any;
    customer_data: any;
    bill_id: any;
    taxes: any[];
    tip_in_cents: any;
}
