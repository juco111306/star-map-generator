"""
Unit tests for the Gelato print-on-demand service and order dispatching.
"""
from app.gelato import (
    get_gelato_product_uid,
    normalize_country_code,
    build_gelato_order_payload,
    submit_order_to_gelato,
)
from app.orders import create_order, OrderCreateRequest, CustomerDetails, dispatch_order_to_gelato


def test_normalize_country_code():
    assert normalize_country_code("Nederland") == "NL"
    assert normalize_country_code("belgië") == "BE"
    assert normalize_country_code("Duitsland") == "DE"
    assert normalize_country_code("United States") == "US"
    assert normalize_country_code("UK") == "GB"
    assert normalize_country_code("") == "NL"


def test_get_gelato_product_uid():
    # 1. Unframed / Classic Matte Posters
    flat_50x70 = get_gelato_product_uid("50x70", "none")
    assert "flat_product_pf_500x700-mm" in flat_50x70
    assert "200-gsm-uncoated" in flat_50x70

    flat_30x40 = get_gelato_product_uid("30x40", "none")
    assert "flat_product_pf_300x400-mm" in flat_30x40

    # 2. Wooden Framed Posters (Natural Wood / Oak)
    oak_50x70 = get_gelato_product_uid("50x70", "oak")
    assert "frame_and_poster_product_frs_500x700-mm" in oak_50x70
    assert "frc_natural-wood" in oak_50x70
    assert "frm_wood" in oak_50x70

    # 3. Wooden Framed Posters (Black Wood)
    black_30x40 = get_gelato_product_uid("30x40", "black")
    assert "frame_and_poster_product_frs_300x400-mm" in black_30x40
    assert "frc_black" in black_30x40

    # 4. Wooden Framed Posters (White Wood)
    white_20x30 = get_gelato_product_uid("20x30", "white")
    assert "frame_and_poster_product_frs_200x300-mm" in white_20x30
    assert "frc_white" in white_20x30


def test_build_gelato_order_payload():
    sample_order = {
        "order_id": "STL-99999",
        "poster_size": "50x70",
        "frame_style": "oak",
        "customer": {
            "name": "Emma de Boer",
            "email": "emma@example.nl",
            "phone": "+31612345678",
            "address_line1": "Keizersgracht 100",
            "city": "Amsterdam",
            "postal_code": "1015 CJ",
            "country": "Nederland",
        },
    }

    payload = build_gelato_order_payload(sample_order)
    assert payload["orderReferenceId"] == "STL-99999"
    assert payload["currency"] == "EUR"
    assert payload["shippingAddress"]["firstName"] == "Emma"
    assert payload["shippingAddress"]["lastName"] == "de Boer"
    assert payload["shippingAddress"]["country"] == "NL"
    assert payload["shippingAddress"]["postCode"] == "1015CJ"
    assert len(payload["items"]) == 1
    assert "natural-wood" in payload["items"][0]["productUid"]
    assert "files" in payload["items"][0]
    assert payload["items"][0]["files"][0]["url"].endswith("/api/orders/STL-99999/pdf")


def test_digital_order_skipped():
    sample_digital = {
        "order_id": "STL-DIGITAL",
        "poster_size": "50x70",
        "frame_style": "digital",
        "customer": {
            "name": "Lucas Jansen",
            "email": "lucas@example.nl",
        },
    }

    res = submit_order_to_gelato(sample_digital)
    assert res["success"] is True
    assert res["status"] == "skipped"
    assert res["gelato_order_id"] is None


def test_dispatch_order_to_gelato():
    req = OrderCreateRequest(
        customer=CustomerDetails(
            name="Sophie van Dijk",
            email="sophie@example.nl",
            address_line1="Singel 42",
            city="Amsterdam",
            postal_code="1012 WP",
            country="Nederland",
        ),
        map_config={
            "poster_size": "30x40",
            "style_id": "midnight_classic",
            "frame_style": "oak",
            "date": "2026-09-22",
            "time": "21:00",
            "latitude": 52.3676,
            "longitude": 4.9041,
        },
    )

    created = create_order(req)
    order_id = created["order_id"]

    dispatch_res = dispatch_order_to_gelato(order_id)
    assert dispatch_res["success"] is True
    assert dispatch_res["order"]["gelato_order_id"] != ""
    assert dispatch_res["order"]["gelato_submitted_at"] != ""
    # Check that Gelato event is present in the timeline
    timeline_titles = [e["title"] for e in dispatch_res["order"]["timeline"]]
    assert any("Gelato" in t for t in timeline_titles)


if __name__ == "__main__":
    test_normalize_country_code()
    test_get_gelato_product_uid()
    test_build_gelato_order_payload()
    test_digital_order_skipped()
    test_dispatch_order_to_gelato()
    print("All Gelato tests passed successfully!")
