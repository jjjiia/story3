import json
from shapely.geometry import shape, Point
import math
import csv
import pprint
#make msa to tract dictionary
#calculate msa scores
#calculate tract scores
#average tract scores by msa
#[u'msa_windows_black', u'msa_windows_hispanic', u'NAME', u'ALAND', u'msa_windows_total', u'msa_windows_white', u'LSAD', u'msa_windows_Id2', u'AWATER', u'msa_windows_Geography', u'CSAFP', u'msa_windows_asian', u'AFFGEOID', u'msa_windows_other', u'GEOID', u'CBSAFP']
def main(fileName):
    
    with open(fileName, 'r') as f:
        js = json.load(f)
       # print js
        dictionary = {}
        
        print(len(js["features"]))
        for key in js["features"]:
            #print key
            point = key["geometry"]["coordinates"]
            gid = key["properties"]["AFFGEOID"]
            name = key["properties"]["NAME"]
            dictionary[gid]={}
            dictionary[gid]["point"]=point
            dictionary[gid]["name"]=name
            
                
    #print js
#                
    with open(fileName+'_byMsaId.json', 'w') as outfile:
       json.dump(dictionary,outfile)
  
    outfile.close()
    
main("centroids.geojson")