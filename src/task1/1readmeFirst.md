<p>I originally underestimated the complexity of this task. While writing unit tests I thought I would be using a combination of some basic rest/destructuring and a simple closure to store the defaults cleanly. As you will see from the result, that is not quite what I ended up with. I hit a barrier when trying to dynamically destructure the default object into arguments for the original function call inside the closure.</p>

<p>In the end I opted for a rather more complex solution that involves interrogating the incoming function to identify its arguments, then combining that with the provided defaults to create a dictionary of all values with their defaults (where present). The generated components are then added as a parameter to the returned closure, to allow iterative calls in the future without undue load on the stack.</p>

<p>This approach has some potential falure points based around edge-case initial function signatures and the closures 'defaultArguments' parameter being overwritten, but it was the best I could do in a short amount of time.</p>

<p> Because this was a small simple repo I opted to do it in baseline node. In retrospect I may have been better off tackling this in typescript and handling this with a factory. Hindsight is always 20:20!</p>

<p>I'm interested in knowing what the optimal solution is. If you could add it to this repo or send it to me at nicholasadrew@hotmail.com, that would be appreciated!</p>

<p>-Nick</p>
