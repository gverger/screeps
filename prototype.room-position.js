let prototype = RoomPosition.prototype;

prototype.onThe = function(direction) {
  switch (direction) {
    case TOP:
      return this.top();
    case BOTTOM:
      return this.bottom();
    case RIGHT:
      return this.right();
    case LEFT:
      return this.left();
    case TOP_RIGHT:
      return this.top().right();
    case TOP_LEFT:
      return this.top().left();
    case BOTTOM_RIGHT:
      return this.bottom().right();
    case BOTTOM_LEFT:
      return this.bottom().left();
  }
}

prototype.top = function() {
  return new RoomPosition(this.x, this.y - 1, this.roomName);
}
prototype.bottom = function() {
  return new RoomPosition(this.x, this.y + 1, this.roomName);
}
prototype.left = function() {
  return new RoomPosition(this.x - 1, this.y, this.roomName);
}
prototype.right = function() {
  return new RoomPosition(this.x + 1, this.y, this.roomName);
}
