from django.shortcuts import render
from rest_framework import generics
from .models import Room
from .serializers import RoomSerialiaser

# Create your views here.
class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerialiaser
