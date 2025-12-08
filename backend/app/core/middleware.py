"""
Middleware for request processing and logging
"""

import time
from typing import Callable
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware to log incoming requests and their processing time
    """
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """
        Process the request and log details
        
        Args:
            request: Incoming request
            call_next: Next middleware/endpoint in chain
            
        Returns:
            Response from the endpoint
        """
        
        # Start timer
        start_time = time.time()
        
        # Get request details
        method = request.method
        path = request.url.path
        client_ip = request.client.host if request.client else "unknown"
        
        # Process request
        response = await call_next(request)
        
        # Calculate processing time
        process_time = time.time() - start_time
        
        # Add custom header with processing time
        response.headers["X-Process-Time"] = str(process_time)
        
        # Log request (in production, use proper logging)
        print(
            f"{method} {path} - "
            f"Status: {response.status_code} - "
            f"IP: {client_ip} - "
            f"Time: {process_time:.4f}s"
        )
        
        return response


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    In-memory rate limiting middleware
    Note: For production, use a better rate-limiter (like slowapi)
    """
    
    def __init__(self, app: ASGIApp, max_requests: int = 100, window_seconds: int = 60):
        """
        Initialize rate limiter
        """
        
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.request_counts: dict[str, list[float]] = {}
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """
        Check rate limit and process request
        Returns: Response from the endpoint or 429 Too Many Requests
        """
        
        # Get client identifier (IP address)
        client_ip = request.client.host if request.client else "unknown"
        
        # Get current time
        current_time = time.time()
        
        # Initialize request history for this client
        if client_ip not in self.request_counts:
            self.request_counts[client_ip] = []
        
        # Remove old requests outside the window
        self.request_counts[client_ip] = [
            req_time for req_time in self.request_counts[client_ip]
            if current_time - req_time < self.window_seconds
        ]
        
        # Check if rate limit exceeded
        if len(self.request_counts[client_ip]) >= self.max_requests:
            return Response(
                content='{"detail": "Rate limit exceeded. Please try again later."}',
                status_code=429,
                media_type="application/json",
                headers={
                    "Retry-After": str(self.window_seconds),
                    "X-RateLimit-Limit": str(self.max_requests),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(int(current_time + self.window_seconds))
                }
            )
        
        # Add current request to history
        self.request_counts[client_ip].append(current_time)
        
        # Add rate limit headers
        response = await call_next(request)
        response.headers["X-RateLimit-Limit"] = str(self.max_requests)
        response.headers["X-RateLimit-Remaining"] = str(
            self.max_requests - len(self.request_counts[client_ip])
        )
        
        return response


def setup_middleware(app):
    """
    Configure all middleware for the FastAPI application
    """
    
    # Add request logging middleware
    app.add_middleware(RequestLoggingMiddleware)
    
    # Add rate limiting middleware (adjust limits as needed)
    # for example vvv
    # app.add_middleware(RateLimitMiddleware, max_requests=1000, window_seconds=60)
