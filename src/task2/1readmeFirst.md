<p>This task was about as complex as I expected when writing the unit tests. The schedules already being sorted was the key feature that allowed me to avoid an exponential solution.</p>

<p> I broke it down into its component parts (1.Flatten 2.Check)</p>

<p>1. Flattening was not too complex as most of the heavy lifting was done by a priority queue. The important thing is that I only had to store (at most) one meeting at a time
from each person in the priority queues heap. I just added a simple 2d index (an index tracker) to track the current meeting being stored for each person</p>

<p>2. Checking by iterating over a sorted flat array.</p>

<p>Maitain a busy end marker for indicating the earliest possible start-time of a free period. Initialise it to start-of-day.
Start iterating.
If the current meetings start time is before the busy end marker then there is no free period. Continue iterating.
If there is a free period, get it's size by comparing the busy end marker to the current start.
If this size is big enough for the new meeting, exit early with a success returning the busy end marker.
If the current meetings end time is past the busy end marker, use it as the new busy end marker and continue iterating.
</p>

<p>-Nick</p>
