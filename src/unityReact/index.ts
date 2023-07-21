import moment from "moment";

export class UnityReactGame{
    gameType : string;
    uniqueGameSettings : string;
    allowedAttempts : number
  
    constructor(gameType : string, uniqueGameSettings : string, allowedAttempts : number){
      this.gameType = gameType
      this.uniqueGameSettings = uniqueGameSettings
      this.allowedAttempts = allowedAttempts
    }
}

export interface StudentResult{
    name : string,
    triviaDatas : any[], 
    numberOfAttempts : number,
    totalGrade : number,
    playingTime : number,
    datePlayed : Date
  
  }

//CLASS FOR CUSTOMIZED GAME DATA SINCE GETSERVERSIDE PROPS DOES NOT ACCEPT NON SERIALIZABLE TYPE SUCH AS DATES AND TIMESTAMP
export class CustomizedGameData{
    allowedAttempts : number
    basedGrading : string
    author : {id : string, name : string}
    classEntry : string
    title : string
    gameType : string
    gameSettingsJSON : string
    startDate : Date
    endDate : Date
  static gameType: string;

    constructor(customizedGameData : any){
        this.allowedAttempts = customizedGameData.allowedAttempts
        this.author = customizedGameData.author
        this.classEntry = customizedGameData.classEntry
        this.title = customizedGameData.title
        this.gameType = customizedGameData.gameType
        this.gameSettingsJSON = customizedGameData.gameSettingsJSON
        this.startDate =  moment.unix(customizedGameData.startDate.seconds).toDate()
        this.endDate = moment.unix(customizedGameData.endDate.seconds).toDate()
        this.basedGrading = customizedGameData.basedGrading
    }
}