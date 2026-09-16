from django.shortcuts import render
from django.views import View
from rest_framework.views import APIView
from rest_framework.response import Response
from .forms import UserRegisterForm
from django.contrib.auth import logout
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required, permission_required
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator

# Correct way to apply decorators to Class-Based Views

class RegisterView(View):
  @method_decorator(ensure_csrf_cookie, name="dispatch")
  def get(self, request):
    form = UserRegisterForm()
    return render(request, "users/register.html", {"form": form})

  def post(self, request):
    form = UserRegisterForm(request.POST)
    if form.is_valid():
      form.save()
      # 1. Create a redirect response object
      response = redirect("blog")
      # 2. Set the cookie on that response object
      response.set_cookie(
          key="my_cookie",
          value="your_value_here",
          httponly=True,  # Keeps it safe from client-side JS scripts
          samesite="Lax",
      )
      return response
    # If the form is invalid, re-render the page with errors
    return render(request, "users/register.html", {"form": form})

class LogoutView(View):
    def get(self,request):
        logout(request)
        return render(request, 'users/logout.html')
    def post(self,request):
        return redirect('blog')

# Create your views here.
@login_required
def dashboard_view(request):
    # This view will only execute if the user is authenticated
    return render(request, 'users/dashboard.html', {'user': request.user})

@login_required
@permission_required('analytics.view_trafficlog', raise_exception=True)
def premium_report_view(request):
    # Only users who have the "can view trafficlog" permission can see this page
    return render(request, 'analytics/reports.html')