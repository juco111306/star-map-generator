"""
Integration tests for FastAPI customer tracking endpoints.
"""
import unittest
from fastapi.testclient import TestClient
from app.main import app
from app.orders import get_all_orders


class TestFastAPICustomerEndpoints(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)
        orders = get_all_orders()
        self.sample_order = orders[0]
        self.order_id = self.sample_order["order_id"]
        self.email = self.sample_order["customer"]["email"]

    def test_customer_track_endpoint(self):
        res = self.client.post(
            "/api/customer/orders/track",
            json={"order_id": self.order_id, "email": self.email},
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["order_id"], self.order_id)
        self.assertIn("timeline", data)
        self.assertIn("carrier", data)

    def test_customer_track_endpoint_wrong_email(self):
        res = self.client.post(
            "/api/customer/orders/track",
            json={"order_id": self.order_id, "email": "wrong@test.com"},
        )
        self.assertEqual(res.status_code, 404)

    def test_customer_history_endpoint(self):
        res = self.client.post(
            "/api/customer/orders/history",
            json={"email": self.email},
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertGreaterEqual(data["count"], 1)
        self.assertEqual(data["email"], self.email.lower())

    def test_update_order_status_endpoint(self):
        res = self.client.patch(
            f"/api/orders/{self.order_id}/status",
            json={
                "status": "printed",
                "carrier": "PostNL",
                "tracking_number": "3STEST9999",
                "note": "Print gereed voor verzending",
            },
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "printed")
        self.assertEqual(data["tracking_number"], "3STEST9999")


if __name__ == "__main__":
    unittest.main()
