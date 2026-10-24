# Acts only on an explicitly identified window owned by this test.
import ctypes,sys
x=ctypes.CDLL('libX11.so.6');x.XOpenDisplay.restype=ctypes.c_void_p;x.XOpenDisplay.argtypes=[ctypes.c_char_p]
d=x.XOpenDisplay(None)
if not d:raise RuntimeError('Display indisponível')
window=int(sys.argv[2],0)
for name in ['XMapRaised','XRaiseWindow','XIconifyWindow','XSetInputFocus','XSync','XCloseDisplay','XDefaultScreen']:
 getattr(x,name).restype=ctypes.c_int
x.XDefaultScreen.argtypes=[ctypes.c_void_p];x.XMapRaised.argtypes=[ctypes.c_void_p,ctypes.c_ulong];x.XRaiseWindow.argtypes=x.XMapRaised.argtypes
x.XIconifyWindow.argtypes=[ctypes.c_void_p,ctypes.c_ulong,ctypes.c_int];x.XSetInputFocus.argtypes=[ctypes.c_void_p,ctypes.c_ulong,ctypes.c_int,ctypes.c_ulong];x.XSync.argtypes=[ctypes.c_void_p,ctypes.c_int];x.XCloseDisplay.argtypes=[ctypes.c_void_p]
if sys.argv[1]=='minimize':x.XIconifyWindow(d,window,x.XDefaultScreen(d))
elif sys.argv[1]=='focus':
 x.XMapRaised(d,window);x.XRaiseWindow(d,window);x.XSetInputFocus(d,window,2,0)
else:raise RuntimeError('Ação inválida')
x.XSync(d,False);x.XCloseDisplay(d)
x.XGetInputFocus.argtypes=[ctypes.c_void_p,ctypes.POINTER(ctypes.c_ulong),ctypes.POINTER(ctypes.c_int)]
d=x.XOpenDisplay(None);focused=ctypes.c_ulong();revert=ctypes.c_int();x.XGetInputFocus(d,ctypes.byref(focused),ctypes.byref(revert));x.XCloseDisplay(d)
print('X11 input focus:',hex(focused.value))
