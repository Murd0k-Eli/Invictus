from django.shortcuts import render
from django.views import View
from .forms import UserRegisterForm
from django.contrib.auth import logout
from django.shortcuts import redirect

class RegisterView(View):
    def get(self, request):
        form = UserRegisterForm()
        return render(request, 'users/register.html', {'form': form})

    def post(self, request):
        form = UserRegisterForm(request.POST)

        if form.is_valid():
            form.save()
            return redirect('index')
        return redirect('register')

class LogoutView(View):
    def get(self,request):
        logout(request)
        return render(request, 'users/logout.html')
    def post(self,request):
        return redirect('index')

# Create your views here.
