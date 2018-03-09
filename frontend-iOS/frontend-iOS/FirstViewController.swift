//
//  FirstViewController.swift
//  frontend-iOS
//
//  Created by Ashwin Vivek on 3/8/18.
//  Copyright © 2018 cs-m117. All rights reserved.
//

import UIKit

class FirstViewController: UITableViewController {

    var testArr1: [[String]] = [["Juventus" , "Tottenham Hotspur"], ["Liverpool FC", "FC Porto"], ["Chelsea FC", "FC Barcelona"]]
    
    var testArr2: [[String]] = [["Manchester City" , "FC Basel"], ["Sevilla", "Manchester United"], ["Real Madrid", "Paris Saint-Germain"], ["Manchester City" , "FC Basel"], ["Sevilla", "Manchester United"], ["Real Madrid", "Paris Saint-Germain"]]
    
    var headerArray: [String] = ["Scheduled Alarms", "Upcoming Matches"]
    
    
    func shouldLabelWidthChange(label: UILabel) -> Bool{
        let size = label.text?.size(withAttributes: [.font: label.font]) ?? .zero
        if(size.width > label.frame.width) {
            return true
        }
        return false
    }
    
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Uncomment the following line to preserve selection between presentations
        // self.clearsSelectionOnViewWillAppear = false

        // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
        // self.navigationItem.rightBarButtonItem = self.editButtonItem
        tableView.clipsToBounds=true
        self.tableView.tableFooterView = UIView()
        self.navigationItem.backBarButtonItem = UIBarButtonItem(title:"", style:.plain, target:nil, action:nil)
        self.navigationItem.title = "Overview"
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
            return testArr1.count+1
        }
        return testArr2.count+1
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
                let cell = tableView.dequeueReusableCell(withIdentifier: "scheduledAlarmCell") as! ScheduledAlarmTVCell
                
                cell.preservesSuperviewLayoutMargins = false
                cell.separatorInset = UIEdgeInsets.zero
                cell.layoutMargins = UIEdgeInsets.zero
                
//                cell.timeLabel.text = "9:30 AM"
                
                //TEAM 1
                cell.team1Label.text = testArr1[indexPath.row-1][0]

                cell.team1Label.textAlignment = NSTextAlignment.center
                cell.team1Label.adjustsFontSizeToFitWidth = true
                
                //TEAM 2
                cell.team2Label.text = testArr1[indexPath.row-1][1]
                
                cell.team2Label.adjustsFontSizeToFitWidth = true
                cell.team2Label.textAlignment = NSTextAlignment.center
            
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
                
                cell.timeLabel.text = "9:30 AM"
                
                cell.team1Label.text = testArr2[indexPath.row-1][0]
                cell.team1Label.adjustsFontSizeToFitWidth = true

                cell.team1Label.textAlignment = NSTextAlignment.center
                
                cell.team2Label.text = testArr2[indexPath.row-1][1]
                cell.team2Label.adjustsFontSizeToFitWidth = true

                cell.team2Label.textAlignment = NSTextAlignment.center
                
                cell.actionButton.setImage(UIImage(named: "alarm-clock.png"), for: .normal)
                
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

}
