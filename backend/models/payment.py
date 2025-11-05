from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime

class PaymentGatewaySettings(BaseModel):
    """Payment gateway configuration"""
    gateway_name: Literal["yoomoney", "qiwi", "telegram_stars"]
    enabled: bool = False
    api_key: Optional[str] = None
    commission: float = 0.0
    extra_config: Optional[dict] = None

class Transaction(BaseModel):
    """Payment transaction"""
    id: Optional[str] = None
    user_id: str
    amount: float
    payment_method: str
    transaction_type: Literal["subscription", "coins", "gift", "boost"] = "subscription"
    status: Literal["pending", "completed", "failed", "refunded"] = "pending"
    gateway_transaction_id: Optional[str] = None
    created_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

class TransactionCreate(BaseModel):
    """Create new transaction"""
    amount: float
    payment_method: str
    transaction_type: str

class PaymentSettings(BaseModel):
    """Global payment settings"""
    min_purchase_amount: int = 100
    max_purchase_amount: int = 100000
    allow_refunds: bool = True
    refund_window_days: int = 7
    auto_verify_payments: bool = True
