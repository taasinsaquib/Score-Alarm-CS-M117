//
//  CreateAlarmViewController.swift
//  frontend-iOS
//
//  Created by Ashwin Vivek on 3/8/18.
//  Copyright © 2018 cs-m117. All rights reserved.
//

import UIKit

class CreateAlarmViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    
    @IBOutlet weak var conditionsTable: UITableView!
    
    @IBOutlet weak var condition1: UILabel!
    @IBOutlet weak var condition2: UILabel!
    @IBOutlet weak var condition3: UILabel!
    @IBOutlet weak var condition4: UILabel!
    
    
    var team1: String = ""
    var team2: String = ""
    var numConditions: Int = 0
    
    var conditionLabels: [UILabel] = []
    var chosenConditions: [String] = ["","","",""]
    
    var cellIndex: Int = 0
    
    @IBAction func setAlarmPressed(_ sender: Any) {
        
        //TODO: POST to the server
        
        performSegue(withIdentifier: "addAlarm", sender: self)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()

        conditionsTable.delegate = self
        conditionsTable.dataSource = self
        // Do any additional setup after loading the view.
        conditionLabels.append(condition1)
        conditionLabels.append(condition2)
        conditionLabels.append(condition3)
        conditionLabels.append(condition4)
    
        for label in conditionLabels {
            label.text = ""
            label.adjustsFontSizeToFitWidth = true
        }
        conditionsTable.addBorderBottom(size: 1, color: .black)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    
    func updateLabel(index: Int) {
        var count = 0
        for condition in chosenConditions {
            if(condition != "") {
                conditionLabels[count].text = "• " + condition
                count+=1
            }
        }
        if(count < 3) {
            for i in count...3 {
                conditionLabels[i].text = ""
            }
        }
        numConditions = count
    }
    
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 1
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        if(indexPath.section == 0) {
            let cell = tableView.dequeueReusableCell(withIdentifier: "goalDifference") as! GoalConditionTVCell
            cell.parentViewController = self
            cell.cellIndex = 0
            return cell
        }
        else if(indexPath.section == 1) {
            let cell = tableView.dequeueReusableCell(withIdentifier: "goalsScoredTeam1") as! GoalConditionTVCell
            cell.parentViewController = self
            cell.cellIndex = 1
            return cell
        }
        else if(indexPath.section == 2) {
            let cell = tableView.dequeueReusableCell(withIdentifier: "goalsScoredTeam2") as! GoalConditionTVCell
            cell.parentViewController = self
            cell.cellIndex = 2
            return cell
        }
        else if(indexPath.section == 3) {
            let cell = tableView.dequeueReusableCell(withIdentifier: "whichTeamLeading") as! GoalConditionTVCell
            cell.parentViewController = self
            cell.isTeamCondition = true
            
            cell.teamNames[0] = team1
            cell.teamNames[1] = team2
            cell.cellIndex = 3
            return cell
        }
        let cell = tableView.dequeueReusableCell(withIdentifier: "reuseIdentifier", for: indexPath)
        
        return cell
    }
    
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
            return CGFloat(100)
    }
    
    func numberOfSections(in tableView: UITableView) -> Int {
        // #warning Incomplete implementation, return the number of sections
        return 4
    }
    
    func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        var ret = ""
        if(section == 0) {
            ret = "Goal Difference"
        }
        if(section == 1) {
            ret = "Goals scored by \(team1)"
        }
        if(section == 2) {
            ret = "Goals scored by \(team2)"
        }
        if(section == 3) {
            ret = "Which team is leading?"
        }
        
        return ret
    }
    
    
    func tableView(_ tableView: UITableView, willDisplayHeaderView view: UIView, forSection section: Int) {
        (view as! UITableViewHeaderFooterView).backgroundView?.backgroundColor = UIColor(red:0.03, green:0.12, blue:0.17, alpha:1.0)
        (view as! UITableViewHeaderFooterView).textLabel?.textColor = UIColor.white
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        var destVC: FirstViewController = segue.destination as! FirstViewController
        
        
        let decoded1  = UserDefaults.standard.data(forKey: "scheduledAlarms") as! Data
        
        var retrievedAlarms = NSKeyedUnarchiver.unarchiveObject(with: decoded1) as! [Alarm]
        

        
        
//        var retrievedUpcomingMatches: [Game] = UserDefaults.standard.object(forKey: "upcomingMatches") as! [Game]
        
        retrievedAlarms.append(Alarm(team1: team1, team2: team2, numConditions: numConditions))

        
        let decoded2  = UserDefaults.standard.data(forKey: "upcomingMatches") as! Data
        var retrievedUpcomingMatches = NSKeyedUnarchiver.unarchiveObject(with: decoded2) as! [Game]
        
        retrievedUpcomingMatches.remove(at: cellIndex-1)
        
        destVC.scheduledAlarms = retrievedAlarms
        destVC.upcomingGames = retrievedUpcomingMatches
        destVC.tableView.reloadData()
    }

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
