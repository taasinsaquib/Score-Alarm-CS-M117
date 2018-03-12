//
//  FirstViewController.swift
//  frontend-iOS
//
//  Created by Ashwin Vivek on 3/8/18.
//  Copyright © 2018 cs-m117. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON

class FirstViewController: UITableViewController {
    
    var testArr2: [[String]] = [["Manchester City" , "FC Basel"], ["Sevilla", "Manchester United"], ["Real Madrid", "Paris Saint-Germain"], ["Manchester City" , "FC Basel"], ["Sevilla", "Manchester United"], ["Real Madrid", "Paris Saint-Germain"]]
    
    var upcomingGames: [Game] = []
    var scheduledAlarms: [Alarm] = []
    
    var headerArray: [String] = ["Scheduled Alarms", "Upcoming Matches"]
    
    var chosenTeam1: String = ""
    var chosenTeam2: String = ""
    var chosenCell: Int = 0
    
    func shouldLabelWidthChange(label: UILabel) -> Bool{
        let size = label.text?.size(withAttributes: [.font: label.font]) ?? .zero
        if(size.width > label.frame.width) {
            return true
        }
        return false
    }
    
    // Mon Mar 12 2018 13:00:00 GMT-0700 (PDT) -> Mon Mar 12 13:00
    func formatDate(date: String) -> String {
        var countSpaces = 0
        var ret = ""
        var k = 0
        var startOfTime = date.startIndex
        var endOfTime = date.startIndex
        var startOfText = date.startIndex
        for (index, char) in date.enumerated() {
            if(char == " ") {
                countSpaces += 1
                var i = startOfText
                if(countSpaces == 3) {
                    i = date.index(startOfText, offsetBy: index)
                    ret = date.substring(to: i)
                    k = index
                }
                if(countSpaces == 4) {
                    startOfTime = date.index(startOfText, offsetBy: index+1)
                }
                if(countSpaces == 5) {
                    endOfTime = date.index(startOfText, offsetBy: index-3)
                    ret += "\n" + date[startOfTime..<endOfTime] + " GMT"
                }
            }
        }
        return ret
    }
    
    override func viewWillAppear(_ animated: Bool) {
        
        var defaults = UserDefaults.standard
        let encodedData1: Data = NSKeyedArchiver.archivedData(withRootObject: self.scheduledAlarms)
        defaults.set(encodedData1, forKey: "scheduledAlarms")
        defaults.synchronize()
        
        let encodedData2: Data = NSKeyedArchiver.archivedData(withRootObject: self.upcomingGames)
        defaults.set(encodedData2, forKey: "upcomingMatches")
        defaults.synchronize()
//        tableView.reloadData()
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Uncomment the following line to preserve selection between presentations
        // self.clearsSelectionOnViewWillAppear = false

        // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
        // self.navigationItem.rightBarButtonItem = self.editButtonItem
        
        Alamofire.request("https://ec02089b.ngrok.io/future").responseJSON(completionHandler: {
            response in
            if let value = response.result.value {
                let json = JSON(value) //Don't forget to import SwiftyJSON
                self.upcomingGames.removeAll()
                for game_num in 0...json.count-1 {
                    var team1 = json[game_num]["teams"][0].stringValue
                    var team2 = json[game_num]["teams"][1].stringValue
                    
                    var time = json[game_num]["start_details"].stringValue
                    
                    let game = Game(team1: team1, team2: team2, date: time)
                    
                    let match = [team1, team2]
                    
                    let contains = self.scheduledAlarms.contains(where: { $0.team1 == match[0] && $0.team2 == match[1] })
                    
                    if(!contains) {
                        self.upcomingGames.append(game)
                    }
                }
                var defaults = UserDefaults.standard
                let encodedData: Data = NSKeyedArchiver.archivedData(withRootObject: self.upcomingGames)
                defaults.set(encodedData, forKey: "upcomingMatches")
                defaults.synchronize()
                self.tableView.reloadData()
            }
        })
        
        tableView.clipsToBounds=true
        self.tableView.tableFooterView = UIView()
        self.navigationItem.backBarButtonItem = UIBarButtonItem(title:"", style:.plain, target:nil, action:nil)
        self.navigationItem.title = "Overview"
        self.navigationItem.hidesBackButton = true
        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    // MARK: - Table view data source

    override func numberOfSections(in tableView: UITableView) -> Int {
        // #warning Incomplete implementation, return the number of sections
        return 2
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // #warning Incomplete implementation, return the number of rows
        if(section == 0) {
            if(scheduledAlarms.count == 0) {
                return 2
            }
            return scheduledAlarms.count+1
        }
        return upcomingGames.count+1
    }

    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        if(indexPath.section == 0) {
            if(indexPath.row == 0) {
                let cell = tableView.dequeueReusableCell(withIdentifier: "headerName") as! SectionHeaderTVCell
                
                cell.headerLabel.text = headerArray[0]
                
                cell.isUserInteractionEnabled = false

                cell.clipsToBounds = true
                return cell
            }
            else {
                if(scheduledAlarms.count == 0) {
                    //NO ALARMS
                    let cell = tableView.dequeueReusableCell(withIdentifier: "noAlarmsCell") as! SectionHeaderTVCell
                    return cell
                }
                let cell = tableView.dequeueReusableCell(withIdentifier: "scheduledAlarmCell") as! ScheduledAlarmTVCell
                
                cell.preservesSuperviewLayoutMargins = false
                cell.separatorInset = UIEdgeInsets.zero
                cell.layoutMargins = UIEdgeInsets.zero
                
//                cell.timeLabel.text = "9:30 AM"
                
                //TEAM 1
                cell.team1Label.text = scheduledAlarms[indexPath.row-1].team1

                cell.team1Label.textAlignment = NSTextAlignment.center
                cell.team1Label.adjustsFontSizeToFitWidth = true
                
                //TEAM 2
                cell.team2Label.text = scheduledAlarms[indexPath.row-1].team2
                
                cell.team2Label.adjustsFontSizeToFitWidth = true
                cell.team2Label.textAlignment = NSTextAlignment.center
                
                cell.numConditionsLabel.text = "\(scheduledAlarms[indexPath.row-1].numConditions) conditions"
            
                cell.actionButton.setImage(UIImage(named: "settings.jpg"), for: .normal)
                cell.clipsToBounds = true
                return cell
            }
        }
        
        if(indexPath.section == 1) {
            if(indexPath.row == 0) {
                let cell = tableView.dequeueReusableCell(withIdentifier: "headerName") as! SectionHeaderTVCell
                
                cell.isUserInteractionEnabled = false

                cell.headerLabel.text = headerArray[1]
                return cell
            }
            else {
                let cell = tableView.dequeueReusableCell(withIdentifier: "upcomingMatchCell") as! UpcomingMatchTVCell
                
                cell.preservesSuperviewLayoutMargins = false
                cell.separatorInset = UIEdgeInsets.zero
                cell.layoutMargins = UIEdgeInsets.zero
                
                cell.timeLabel.text = formatDate(date: upcomingGames[indexPath.row-1].date)
                
                cell.team1Label.text = upcomingGames[indexPath.row-1].team1
                cell.team1Label.adjustsFontSizeToFitWidth = true

                cell.team1Label.textAlignment = NSTextAlignment.center
                
                cell.team2Label.text = upcomingGames[indexPath.row-1].team2
                cell.team2Label.adjustsFontSizeToFitWidth = true

                cell.team2Label.textAlignment = NSTextAlignment.center
                
                cell.actionButton.setImage(UIImage(named: "alarm-clock.png"), for: .normal)
                
                cell.parentViewController = self
                cell.cellIndex = indexPath.row
                return cell
            }
        }
        let cell = tableView.dequeueReusableCell(withIdentifier: "reuseIdentifier", for: indexPath)

        return cell
    }
    
    override func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        
            if(indexPath.row == 0) {
                return CGFloat(58)
            }
            else {
                
                return CGFloat(94)
            }
        
    }
    
    override func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return CGFloat(10)
    }
    
    override func tableView(_ tableView: UITableView, willDisplayHeaderView view: UIView, forSection section: Int) {
        (view as! UITableViewHeaderFooterView).backgroundView?.backgroundColor = UIColor.clear
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        var destVC: CreateAlarmViewController = segue.destination as! CreateAlarmViewController
        destVC.team1 = chosenTeam1
        destVC.team2 = chosenTeam2
        destVC.cellIndex = chosenCell
    }

}
