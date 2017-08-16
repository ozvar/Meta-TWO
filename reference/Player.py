'''
Created on Feb 22, 2013

@author: Alex
'''


#import winsound

from Playfield import Playfield
from Piece import Piece
from Keys import Keys
from NintendoLFSR import NintendoLFSR

class Sound(): #XXX: building this here then moving it out
    def __init__(self):
        pass
    
    def receive(self, event):
#        if isinstance(event, basestring):
#            if event == 'move':
#                winsound.Beep(800, 16)
#            if event == 'rotate':
#                winsound.Beep(400, 16)
#            if event == 'lock':
#                winsound.Beep(200, 32)
#            if event == 'line':
#                winsound.Beep(300, 32)
      pass #forgot about this stuff, lol -- clearly not portable

class Player():
    speedlevels = [48, 43, 38, 33, 28, 23, 18, 13, 8, 6,
                   5, 5, 5, 4, 4, 4, 3, 3, 3, 2,
                   2, 2, 2, 2, 2, 2, 2, 2, 2, 1,
                   1, 1,]
    scorevals = [0, 40, 100, 300, 1200]
    
    DAS_NEGATIVE_EDGE=10
    DAS_MAX=16
    GRAVITY_START_DELAY=97
    LINECLEAR_STEPS=5 #XXX: variable playfield width?
    
    def __init__(self, keys=Keys(), random=NintendoLFSR()):
        self.subscribers = []
        
        self.addSubscriber(Sound()) #XXX: test
        
        self.playfield = Playfield()
        self.piece = Piece()
        self.keys = keys
        self.random = random
        
        self.frames = 0
        
        self.alive = True
        
        self.controllerGlitching = False
        
        self.paused = False
        
#        self.phase = self.active
        self.phase = self.start
        self.are = 0
        self._49 = 0 #XXX: I'm not 100% sure what this is set to at game start, but this seems as reasonable an assumption as any.
        
        self.vx = 0
        self.vy = 0
        self.vr = 0
        
        self.das = 0
        self.softdrop_timer = 0
        self.drop = 0
        
        self.start_level = 0
        self.level = 0
        self.lines = 0
        self.score = 0
        
        self.drop_points = 0
        self.lines_this = 0
        self.lines_flagged = 0
        
        self.curr = 0
        self.next = 0
        
        self.piece_count = 0
        #self.drought_count = 0   
    
    def addSubscriber(self, sub):
        self.subscribers.append(sub)
        
    def notify(self, event):
        for s in self.subscribers:
            s.receive(event)
     
    def start(self):
        self.playfield.__init__()
        
        self.paused = False
        
        self.alive = True
        self.phase = self.active   #XXX
        self.level = self.start_level
        self.lines = 0
        self.score = 0
        
        self.are = 0
        self._49 = 0 #XXX: I'm not 100% sure what this is set to at game start, but this seems as reasonable an assumption as any.
        self.drop = 0
        
        #A negative value is loaded into the soft drop counter for pre-gravity on the first piece.
        #As such, pre-gravity can be canceled out of by pressing Down to start soft dropping.
        self.softdrop_timer = -Player.GRAVITY_START_DELAY
        
        self.curr = self.random.select()
        self.random.next()
        self.next = self.random.select()
        
        self.piece.spawn(self.curr)
        
        #self.callback()
    
    def control(self):
        #if(self.keys.is_down(Keys.RIGHT & Keys.LEFT & Keys.DOWN)):
#       #if(self.keys.is_down(Keys.RIGHT) and self.keys.is_down(Keys.LEFT) and self.keys.is_down(Keys.DOWN)):
#            #self.controllerGlitching = True    #NYI: Need to do more research to reproduce properly.
#            #At a high level, it prevents the active time routine from being called every other frame.
#            #$0000/$0001 toggles between pointing at the usual address and something completely different.
#            #Sprite display (current piece, next piece) is also disabled on the bugged frames.
#            #I still need to see how it interacts with various phases of entry delay as well.
            #pass
        #else:
            if(self.keys.is_up(Keys.DOWN)):
                if(self.keys.hit(Keys.RIGHT|Keys.LEFT)):
                    self.das = 0
                    
                if(self.keys.is_down(Keys.RIGHT)):
                    self.vx = 1
                elif(self.keys.is_down(Keys.LEFT)):
                    self.vx = -1
                else:
                    self.vx = 0
            else:
                self.vx = 0
            
    
            if(self.softdrop_timer < 0):
                if(self.keys.hit(Keys.DOWN)):
                    self.softdrop_timer = 0
                else:
                    self.softdrop_timer += 1
                
            if(self.softdrop_timer >= 0):
                if(self.softdrop_timer == 0):
                    if(self.keys.is_down(Keys.RIGHT | Keys.LEFT)):
                        pass    #do regular gravity
                    elif(self.keys.hit(Keys.DIR) == Keys.DOWN):    #if down is the only direction hit this frame
                        self.softdrop_timer = 1
                else:
                    if(self.keys.is_down(Keys.DIR) == Keys.DOWN):
                        self.softdrop_timer += 1
                        if(self.softdrop_timer > 2):
                            self.softdrop_timer = 1
                            self.drop_points += 1
                            self.vy = 1
                        else:
                            self.vy = 0
                    else:
                        self.softdrop_timer = 0
                        self.vy = 0
                        self.drop_points = 0
                        
            if(self.keys.hit(Keys.A)):
                self.vr = 1
            elif(self.keys.hit(Keys.B)):
                self.vr = -1
            else:
                self.vr = 0
 
    def move(self, vx):
        if vx != 0:
            shift = False
            if self.das == 0:
                shift = True
            
            if self.das >= Player.DAS_MAX:
                shift = True
                self.das = Player.DAS_NEGATIVE_EDGE
            self.das += 1
            
            if shift:
                if not self.piece.collide(self.playfield, vx=vx):
                    self.piece.x += vx
                    self.notify('move')
                else:
                    self.das = Player.DAS_MAX
    
    def rotate(self, vr):
        if vr != 0:
            self.notify('rotate')
            if not self.piece.collide(self.playfield, vr=vr):
                self.piece.r += vr
                self.piece.r &= 3
    
    def gravity(self, vy):
        if self.softdrop_timer < 0:
            return

        if(self.vy != 0 or self.drop >= Player.speedlevels[self.level if self.level < 29 else 29]):
            self.vy = 0;
            self.drop = 0;
            if not self.piece.collide(self.playfield, vy=1):
                self.piece.y += 1;
            else:
                self.notify('lock')
                self.sub_9caf() #sets $0049 variable as appropriate for update phase length
                self.phase = self.update
    
    def active(self):
        #if not self.controllerGlitching:
            self.control()
            self.move(self.vx)
            self.rotate(self.vr)
            self.gravity(self.vy)
        #else:
        #    self.controllerGlitching = False
       
    
    def update(self): 
        #The ARE counter approach for this method has been deprecated due to interactions with pause.
        #While the old approach did get the correct number of frames when the game was not paused,
        #logic that I believed was only relevant to NES graphics updates can actually cause syncing problems
        #when pausing is introduced. The new code will also more accurately represent the amount of frames
        #spent in each phase.
        
        if self.are == 0: #XXX: quick hack to do commit on first frame using ARE counter as the flag...
            #I'm not sure what mechanism controls whether to make the commit attempt or not. Surely it's only doing it one time around.
            self.are = 1
            gameover = self.playfield.commit(self.piece)
            if gameover:
                self.alive = False
        
        if self._49 < 0x20: #from sub_99b8
            return
        
        self.are = 0 #XXX: quick hack, unsets "flag" to make commit attempt
        self.sub_9caf()
        self.phase = self.lineCheck 
        
#        #The duration of this phase of ARE is dependent on the piece's lock height.
#        variable_delay = (((self.playfield.height-self.piece.y-1)/4) + 1)
#        variable_delay = variable_delay if (variable_delay < 5) else 5

        #If the piece overlaps a block already present in the playfield on commit, the game is over.
        #if self.are == 0: #deprecated
        #if True:
#            gameover = self.playfield.commit(self.piece)
#            if gameover:
#                self.alive = False
#            self.sub_9caf()
#            self.phase = self.lineCheck 
    
        #deprecated -- now uses $0049 as "gatekeeper," as in the original game
        #self.are += 1
    
#        if(self.are >= variable_delay*2):
#            self.are = 0
#            self.phase = self.lineCheck
#            return
        
    
    def lineCheck(self):
        if self._49 < 0x20: #from sub_9a6b
            return
        
        row = self.piece.y
        row = 0 if row < 0 else row
        #adding ARE counter after clamping the row within the visible playfield
        #is critical to proper behavior in conjunction with the row 0 line clear bug
        #NYI - options to disable bug reproduction
        row += self.are
        
        if row >= self.playfield.height:
            pass
        elif self.playfield.lineCheck(row):
            self.playfield.lineDrop(row)
            self.lines_this += 1
        
        self.are += 1
    
        if(self. are >= 4):
            self._49 = 0 #from sub_9a6b
    
            self.are = 0;
            if(self.lines_this != 0):
                self.phase = self.lineAnim
            else:
                self.phase = self.scoreUpdate
    
    def lineAnim(self):
        #TODO: REAL SOUND
        #The real way to do sound will be some sort of subscriber pattern.
        #We'll keep a list of subscribed objects and ping them on things like lockdown.
        #When pinged, the Sound class or whatever will queue up the synth or just play some WAVs or whatever is necessary.
        
        
        pass #XXX: sigh... see sub_94ee, or the note I left below before commenting things out
        #mostly dummy for now -- probably need to mimic tilemaps for the actual animation
#        if (self.frames&3) == 0:
#            self.are += 1
#    
#        if(self.are >= Player.LINECLEAR_STEPS):
#            self.are = 0
#            self.phase = self.scoreUpdate
            #self.phase() #XXX: an inconvenience of how I engineered things
            #as it so turns out, the line animation handling occurs in sub_94ee, which handles various duties every frame
            #as a result, it advances to the next phase in a chunk of the code _before_ using jump table to handle "phase specific code"
            #so, when advancing frame by frame, the line clear animation introduces an edge case where phase #5 (score update)
            #appears to be skipped... welp! It may be more prudent to relocate the code from this function to the sub_94ee() I wrote,
            #and just leave a note about the behavior here. For now, I'll double-call to self.phase() as a test patch.
            
    def scoreUpdate(self):        
        lines_before = self.lines
        self.lines += self.lines_this;
#            if(self.lines >= (self.level+1) * 10):  #XXX: not adjusted for start level
#                self.level += 1
        if self.lines/10 > lines_before/10:
            hex_trick = self.lines/10
            hex_trick = int(str(hex_trick), 16) #XXX: hex magic hacks once again
            if hex_trick > self.level: 
                self.level += 1
                #print "level up", self.level, "\thex magic =", hex_trick
        
        self.level &= 255;  #XXX
        
        self.score += (self.level+1)*Player.scorevals[self.lines_this]
        
#        if(self.lines_this > 0):
#            print self.score, '\tlines cleared', self.lines_this
        
        #To replicate the drop score bug, we need to convert the last two digits to packed binary coded decimal.
        if self.drop_points >= 2:
            hex_trick = int(str(self.score % 100), 16)
            
            hex_trick -= 1
            hex_trick += self.drop_points
            if hex_trick & 0x0F >= 0x0A: hex_trick += 0x06
            #if hex_trick & 0xF0 >= 0xA0: hex_trick += 0x60
            if hex_trick & 0xF0 >= 0xA0: hex_trick &= 0xF0; hex_trick += 0x60
            
            self.score -= self.score%100
            self.score += int(hex(hex_trick)[2:], 10)
            
#            print self.score, '\trows forced = ', self.drop_points
    
        self.phase = self.goalCheck
    
    def goalCheck(self):
        #It's only important in B-Type -- it checks if all 25 lines have been cleared.
        #We can move onto the dummy frame for now.
        self.phase = self.dummy
        
    def dummy(self):
        #This game phase contains code for unfinished 2 Player functionality.
        #The retail game only supports one player, so the code is skipped.
        #Nothing else of note happens on this frame.
        self.phase = self.prep
        
    def prep(self):
        if self._49 < 0x20: #see sub_988e
            return
        
        self.are = 0
          
        self.lines_this = 0
        self.drop_points = 0
    
        self.softdrop_timer = 0
        self.drop = 0
        self. vy = 0
    
        #random.next();    //NWC90 specific -- RNG is shifted per piece rather than per frame.
        self.curr = self.next
        self.piece.spawn(self.curr)
    
        self.next = self.random.select();
    
        self.phase = self.active
    
    def doFrame(self, input=0x0000000):
        self.sub_94ee()
        
        #self.keys.receive(input) #XXX: moving this to the Screen container
        
        #if self.keys.hit(Keys.START): #XXX
            #self.paused ^= True
        #if not self.paused: #XXX
        if not self.controllerGlitching: #XXX
            self.drop += 1
        
        if not self.controllerGlitching: #XXX
            self.phase()
        
        if(self.keys.is_down(Keys.RIGHT) and self.keys.is_down(Keys.LEFT) and self.keys.is_down(Keys.DOWN)): #XXX
            if(not self.keys.is_down(Keys.UP|Keys.B|Keys.A|Keys.SELECT|Keys.START)):
                self.controllerGlitching ^= True
        else:
            self.controllerGlitching = False
            
        self.frames +=1
    
    def unpause(self): #XXX: called from PauseScreen in the enclosing session
        self.paused = False
        self._49 = 0 #This little bugger is what was screwing up the timing.
        #Fun fact! Because of the "gatekeeper" nature of $0049 for certain phases,
        #it's possible to indefinitely sustain ARE! Just mash Start at a sufficient rate,
        #and presto, you'll never get out of the delay phases.
        
        #One point of concern is a slight mismatch in values across pause/unpause compared to the original ROM.
        #I'm maintaining frame sync and I'm able to play back high precision input (such as the old max-out TAS),
        #but it may be a point of concern if it turns out other bugs or eccentricities also rely on precise values of $0049.
        
    ################REFERENCE STUBS START################
    
    #These are acting as notes on some details from subroutines in the original ROM.
    #I may be calling a few of these (notably sub_94ee, sub_9caf) in the body of the code,
    #so they may also be promoted out of this block where applicable. However, I don't
    #have particularly good names for these at the moment, nor the $0049 variable
    #that they largely pertain to at time of writing.
    
    def sub_94ee(self): #appears to be called every frame to handle various duties
        if self.phase == self.lineAnim:
            #do some memory mirroring b/w 1P and 2P address spaces, because Reasons
            #do line clear animation stuff
            #mostly dummy for now -- probably need to mimic tilemaps for the actual animation
            if (self.frames&3) == 0:
                self.notify('line')
                self.are += 1
        
            if(self.are >= Player.LINECLEAR_STEPS):
                self.are = 0
                self.phase = self.scoreUpdate
            #zero out $0069 which will later overwrite $0049
            #so, for my purposes because the memory mirroring is stupid,
            self._49 = 0 #congratulations $0049, you are now zero
            #then it jumps somewhere else to skip over unfinished 2P code, and probably other stuff
        else:
            for _ in xrange(4):
                self.sub_9725()
    
    def sub_9725(self):
        if self._49 > 0x15:
            return
        #some graphics stuff happens that's not relevant to the rules
        self._49 += 1
        
        if self._49 < 0x14:
            return
        self._49 = 0x20
        
    def sub_9caf(self):
        self._49 = self.piece.y
        if self._49 < 0:
            self._49 = 0
            
    def sub_99b8(self): #related to phase #2, commit
        #looks to be responsible for committing the piece to the playfield once $0049 has rolled over
        #also calls 9CAF which resets $0049 back to piece.y again
        if self._49 < 0x20:
            return
        self.sub_9caf()
        
    def sub_9a6b(self): #related to phase #3, line check
        if self._49 >= 0x20:
            #do this frame's line check
            #after checking the requisite number of lines, set $0049 to zero
            pass
        else:
            return
        
    def sub_988e(self): #related to phase #8, prep
        if self._49 < 0x20:
            return
        #otherwise, prep etc.
    ################REFERENCE STUBS END################