# ScrollView Gesture Repro

This repository demonstrates a use case for React Native Gesture Handler that I’m having trouble implementing on web.

The app features a ScrollView from react-native-gesture-handler, with child components that include various content and SwipeableItems. These items utilize a GestureDetector and a custom Gesture.Pan() to enable horizontal swipe gestures.

The challenge is getting these components to work seamlessly together. The SwipeableItems should respond to horizontal pan gestures without interfering with the vertical scrolling of the ScrollView. However, the current setup causes Gesture.Pan() to capture all gesture events, preventing smooth scrolling. I would expect that the combination of `failOffsetY` and `simultaneousWithExternalGesture` should work.

Additionally, I’ve found the documentation to be a bit confusing. It’s unclear how to set up this combination of gestures, as there’s no mention of a ScrollView component. The documentation also references a waitFor method for managing gestures, but this method doesn’t seem to be available with Gesture.Pan().

Any advice on resolving these issues or improving the setup would be greatly appreciated! Examples in the documentation for common patterns like this one would also be incredibly helpful.

---

## Demo

Here’s a preview of the current behavior. I'm able to use the ScrollView swipe up/down between the items, but not on the items themselves.



https://github.com/user-attachments/assets/63df5cfc-c1bc-4f25-987d-e6ac68fd439b




https://github.com/user-attachments/assets/0052c7c3-4de5-4a8f-ad6b-4d6a0dc0257a


<video src="demo.mov" controls width="600"></video>
