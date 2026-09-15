from django.shortcuts import render
from django.views import View
from .forms import UserRegisterForm
from django.contrib.auth import logout
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required, permission_required

class RegisterView(View):
    def get(self, request):
        form = UserRegisterForm()
        return render(request, 'users/register.html', {'form': form})

    def post(self, request):
        form = UserRegisterForm(request.POST)

        if form.is_valid():
            form.save()
            return redirect('blog:home')  # Redirect to the home page after successful registration
        return redirect('register')

class LogoutView(View):
    def get(self,request):
        logout(request)
        return render(request, 'users/logout.html')
    def post(self,request):
        return redirect('blog:home')

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