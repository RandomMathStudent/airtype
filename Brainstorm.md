#Brainstorming Space 

As far as steps go, I think step 1 is to be able to canvas a half split keyboard where each half follows a hand. 
A big bulk of the challenge is going to be identifying what consistutes a "keystroke". 

My current thinking is this: 
  - There must be information out there about commonly put together letters or "probability distributions" on what letter comes next after a letter is typed
  - if we have a keyboard drawn already, we should be able to label by likelihood based on said probability distribution
  - following from this we can draw vectors from all the fingers to the probability regions
  - we can then compare actual vectors of finger movement to these probability vectors and come up with some sound way to pick the one that makes the most sense and
    register the keystroke that makes the most sense based on this vector comparison
  - we also need a way of filtering out movement of fingers that will create vectors but arent actually typing
