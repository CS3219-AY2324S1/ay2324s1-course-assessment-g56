export enum Difficulty {
  ANY = 'ANY',
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
  //Unknown in the event that the socket disconnects, we need to figure out what difficulty they were in
  UNKNOWN = 'UNKNOWN'
}
