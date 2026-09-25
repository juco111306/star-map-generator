"""
Unit and integration tests for customer order tracking & history backend.
"""
import unittest
from app.orders import (
    get_all_orders,
    get_order_by_id,
    get_orders_by_email,
    get_order_by_id_and_email,
    update_order_status,
)


class TestCustomerOrderTracking(unittest.TestCase):

    def test_get_all_orders_normalized(self):
        orders = get_all_orders()
        self.assertIsInstance(orders, list)
        self.assertGreater(len(orders), 0)
        
        first = orders[0]
        self.assertIn("order_id", first)
        self.assertIn("status", first)
        self.assertIn("carrier", first)
        self.assertIn("timeline", first)
        self.assertIsInstance(first["timeline"], list)
        self.assertGreater(len(first["timeline"]), 0)

    def test_track_order_valid_credentials(self):
        orders = get_all_orders()
        sample = orders[0]
        order_id = sample["order_id"]
        email = sample["customer"]["email"]

        # Exact match
        result = get_order_by_id_and_email(order_id, email)
        self.assertIsNotNone(result)
        self.assertEqual(result["order_id"], order_id)
        # Verify internal producer notes are sanitized out
        if "customer" in result:
            self.assertNotIn("producer_notes", result["customer"])

        # Case insensitive email and without 'STL-' prefix
        clean_digits = order_id.replace("STL-", "")
        result2 = get_order_by_id_and_email(clean_digits, email.upper())
        self.assertIsNotNone(result2)
        self.assertEqual(result2["order_id"], order_id)

    def test_track_order_mismatched_email(self):
        orders = get_all_orders()
        sample = orders[0]
        order_id = sample["order_id"]

        result = get_order_by_id_and_email(order_id, "wrong.email@random.com")
        self.assertIsNone(result)

    def test_customer_order_history_by_email(self):
        orders = get_all_orders()
        sample = orders[0]
        email = sample["customer"]["email"]

        history = get_orders_by_email(email)
        self.assertIsInstance(history, list)
        self.assertGreaterEqual(len(history), 1)
        for ord_item in history:
            self.assertEqual(ord_item["customer"]["email"].lower(), email.lower())
            self.assertNotIn("producer_notes", ord_item["customer"])

    def test_update_order_status_and_timeline(self):
        orders = get_all_orders()
        sample = orders[0]
        order_id = sample["order_id"]
        initial_timeline_len = len(sample.get("timeline", []))

        updated = update_order_status(
            order_id=order_id,
            new_status="shipped",
            carrier="PostNL",
            tracking_number="3SABCD123456789",
            note="Pakket verzonden met PostNL Track & Trace",
        )
        self.assertIsNotNone(updated)
        self.assertEqual(updated["status"], "shipped")
        self.assertEqual(updated["tracking_number"], "3SABCD123456789")
        self.assertIn("postnl.nl", updated["tracking_url"])
        self.assertGreater(len(updated["timeline"]), initial_timeline_len)
        last_event = updated["timeline"][-1]
        self.assertEqual(last_event["status"], "shipped")


if __name__ == "__main__":
    unittest.main()
