from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, Http404
from django.forms.models import model_to_dict

from .models import Channel, Message

def channels(request):
    if request.method == 'GET':
        channels = list(map(lambda x : model_to_dict(x), Channel.objects.all()))
        return JsonResponse(channels, safe=False)
    else if request.method == 'POST':
        channel = Channel(name=request.POST['name'])
        channel.save()
        return JsonResponse({"pk": channel.pk})
    else
        return Http404("Invalid request type")


def channel_detail(request, pk):
    channel = get_object_or_404(Channel, pk=pk)
    return JsonResponse(model_to_dict(channel))

def messages(request, pk):
    if request.method == 'GET':
        channel = get_object_or_404(Channel, pk=pk)
        messages = list(map(lambda m : model_to_dict(m), \
                Message.objects.filter(channel=channel).order_by(timestamp)))

        return JsonResponse(messages, safe=False)
    else if request.method == 'POST':
        text = request.POST['text'];
        message = Message(text=text, channel=pk)
        message.save()
        return JsonResponse({"pk": message.pk})
    else
        return Http404('Invalid request type')
