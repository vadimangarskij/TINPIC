import os
import aiohttp
import json
from typing import Dict, Optional
from datetime import datetime, timedelta

class PaymentService:
    def __init__(self):
        self.yoomoney_key = os.getenv("YOOMONEY_API_KEY")
        self.qiwi_key = os.getenv("QIWI_API_KEY")
        self.telegram_token = os.getenv("TELEGRAM_BOT_TOKEN")
    
    async def create_subscription_payment(self, user_id: str, plan_type: str, 
                                         payment_method: str) -> Dict:
        """Create payment for premium subscription"""
        
        # Pricing (in RUB)
        prices = {
            "premium_monthly": 499,
            "premium_yearly": 2999,
            "vip_monthly": 999
        }
        
        amount = prices.get(plan_type, 499)
        
        if payment_method == "yoomoney":
            return await self._create_yoomoney_payment(user_id, amount, plan_type)
        elif payment_method == "qiwi":
            return await self._create_qiwi_payment(user_id, amount, plan_type)
        elif payment_method == "telegram":
            return await self._create_telegram_payment(user_id, amount, plan_type)
        else:
            raise ValueError(f"Unsupported payment method: {payment_method}")
    
    async def create_coin_purchase(self, user_id: str, coin_package: str, 
                                  payment_method: str) -> Dict:
        """Create payment for coin purchase"""
        
        # Coin packages
        packages = {
            "small": {"coins": 100, "price": 99},
            "medium": {"coins": 500, "price": 399},
            "large": {"coins": 1000, "price": 699},
            "mega": {"coins": 2500, "price": 1499}
        }
        
        package = packages.get(coin_package)
        if not package:
            raise ValueError(f"Invalid coin package: {coin_package}")
        
        if payment_method == "yoomoney":
            return await self._create_yoomoney_payment(user_id, package["price"], 
                                                      f"coins_{package['coins']}")
        elif payment_method == "qiwi":
            return await self._create_qiwi_payment(user_id, package["price"], 
                                                  f"coins_{package['coins']}")
        elif payment_method == "telegram":
            return await self._create_telegram_payment(user_id, package["price"], 
                                                      f"coins_{package['coins']}")
    
    async def _create_yoomoney_payment(self, user_id: str, amount: int, 
                                      description: str) -> Dict:
        """Create YooMoney payment"""
        if not self.yoomoney_key:
            return {
                "success": False,
                "error": "YooMoney not configured",
                "payment_url": None
            }
        
        try:
            # YooMoney API integration
            async with aiohttp.ClientSession() as session:
                payload = {
                    "amount": amount,
                    "currency": "RUB",
                    "description": description,
                    "return_url": f"connectsphere://payment/success",
                    "label": user_id
                }
                
                headers = {
                    "Authorization": f"Bearer {self.yoomoney_key}",
                    "Content-Type": "application/json"
                }
                
                # Mock response for development
                payment_id = f"yoomoney_{user_id}_{datetime.now().timestamp()}"
                payment_url = f"https://yoomoney.ru/checkout/{payment_id}"
                
                return {
                    "success": True,
                    "payment_id": payment_id,
                    "payment_url": payment_url,
                    "amount": amount,
                    "currency": "RUB",
                    "provider": "yoomoney"
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "payment_url": None
            }
    
    async def _create_qiwi_payment(self, user_id: str, amount: int, 
                                  description: str) -> Dict:
        """Create QIWI payment"""
        if not self.qiwi_key:
            return {
                "success": False,
                "error": "QIWI not configured",
                "payment_url": None
            }
        
        try:
            # QIWI API integration
            payment_id = f"qiwi_{user_id}_{datetime.now().timestamp()}"
            payment_url = f"https://qiwi.com/payment/{payment_id}"
            
            return {
                "success": True,
                "payment_id": payment_id,
                "payment_url": payment_url,
                "amount": amount,
                "currency": "RUB",
                "provider": "qiwi"
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "payment_url": None
            }
    
    async def _create_telegram_payment(self, user_id: str, amount: int, 
                                      description: str) -> Dict:
        """Create Telegram Stars payment"""
        if not self.telegram_token:
            return {
                "success": False,
                "error": "Telegram bot not configured",
                "payment_url": None
            }
        
        try:
            # Telegram Stars API integration
            payment_id = f"tg_{user_id}_{datetime.now().timestamp()}"
            
            # Convert RUB to Stars (approximate rate)
            stars = int(amount / 10)  # 1 Star ≈ 10 RUB
            
            return {
                "success": True,
                "payment_id": payment_id,
                "amount": stars,
                "currency": "STARS",
                "provider": "telegram",
                "telegram_invoice_url": f"https://t.me/ConnectSphereBot?start=pay_{payment_id}"
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "payment_url": None
            }
    
    async def verify_payment(self, payment_id: str, provider: str) -> Dict:
        """Verify payment status"""
        
        if provider == "yoomoney":
            return await self._verify_yoomoney_payment(payment_id)
        elif provider == "qiwi":
            return await self._verify_qiwi_payment(payment_id)
        elif provider == "telegram":
            return await self._verify_telegram_payment(payment_id)
        else:
            return {"verified": False, "status": "unknown_provider"}
    
    async def _verify_yoomoney_payment(self, payment_id: str) -> Dict:
        # Mock verification for development
        return {
            "verified": True,
            "status": "completed",
            "payment_id": payment_id
        }
    
    async def _verify_qiwi_payment(self, payment_id: str) -> Dict:
        # Mock verification for development
        return {
            "verified": True,
            "status": "completed",
            "payment_id": payment_id
        }
    
    async def _verify_telegram_payment(self, payment_id: str) -> Dict:
        # Mock verification for development
        return {
            "verified": True,
            "status": "completed",
            "payment_id": payment_id
        }

payment_service = PaymentService()
