from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, Http404, HttpResponse
from django.forms.models import model_to_dict
from django.middleware.csrf import get_token

from .models import Channel, Message

def channels(request):
    if request.method == 'GET':

        if Channel.objects:
            channels = list(map(lambda x : model_to_dict(x), Channel.objects.all()))
            return JsonResponse(
                {
                    "status": True,
                    "Channels": channels
                },
                    safe=False,
                    status=200)
        else:
            return JsonResponse(
                    {
                        "status": True,
                        "Channels": ""
                    },
                        status=200)

    elif request.method == 'PUT':
        name = request.headers['name']

        if not name:
            return JsonResponse(
                    {
                        "status": False,
                        "message": "must include 'name' header"
                    },
                        status=422)
        elif Channel.objects.filter(name=name).exists():
            return JsonResponse({"status": True}, status=201)
        else:
            channel = Channel(name=name)
            channel.save()
            return JsonResponse({"pk": channel.pk}, status=200)
    else:
        return bad_request_type(request)
def channel_detail(request, pk):
    if request.method == 'GET':
        channel = Channel.objects.filter(pk=pk)
        if channel.exists():
            return JsonResponse(
                    {
                        "status": True,
                        "Channel": model_to_dict(channel.first())
                    },
                        status=200)
        else:
            return JsonResponse({"status": False}, status=404)

    #FIXME NotImplemented
    #elif request.method == 'DELETE':
        ###raise NotImplementedError
    else:
        return bad_request_type(request)

def messages(request, pk):
    if request.method == 'GET':
        channel = get_object_or_404(Channel, pk=pk)
        messages = list(map(lambda m : model_to_dict(m), \
                Message.objects.filter(channel=channel).order_by('timestamp')))

        return JsonResponse(messages, safe=False, status=200)
    elif request.method == 'POST':
        text = request.POST['text']
        message = Message(
                    text=text,
                    channel=Channel.objects.get(pk=pk),
                    author=request.user
                )
        message.save()
        return JsonResponse({"pk": message.pk}, status=200)
    else:
        return bad_request_type(request)



def bad_request_type(request):
        return JsonResponse(
                {
                   "status": False,
                    "message": f"request method {request.method} not supported"
                },
                    status=405)


