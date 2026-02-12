"""
Batch Analysis Script
Analyzes all students in the dataset and generates a risk report
"""

from dropout_predictor import DualScalingDropoutPredictor
import pandas as pd
import json
from datetime import datetime

def analyze_all_students():
    print("="*60)
    print("BATCH DROPOUT RISK ANALYSIS")
    print("="*60)
    
    # Load model
    predictor = DualScalingDropoutPredictor()
    predictor.load_model('models/dropout_model.pkl')
    
    # Load data
    df = pd.read_csv('data.csv', sep=';')
    print(f"\nAnalyzing {len(df)} students...")
    
    # Analyze each student
    results = []
    risk_counts = {'CRITICAL': 0, 'HIGH': 0, 'MEDIUM': 0, 'LOW': 0}
    
    for idx, row in df.iterrows():
        student_data = row.to_dict()
        prediction = predictor.predict(student_data)
        
        results.append({
            'student_index': idx,
            'actual_outcome': student_data['Target'],
            'predicted_outcome': prediction['prediction'],
            'risk_level': prediction['risk_level'],
            'dropout_probability': prediction['dropout_probability'],
            'academic_risk': prediction['academic_risk_score'],
            'socioeconomic_risk': prediction['socioeconomic_risk_score']
        })
        
        risk_counts[prediction['risk_level']] += 1
        
        if (idx + 1) % 100 == 0:
            print(f"  Processed {idx + 1}/{len(df)} students...")
    
    # Create DataFrame
    results_df = pd.DataFrame(results)
    
    # Generate report
    print("\n" + "="*60)
    print("ANALYSIS COMPLETE")
    print("="*60)
    
    print(f"\nTotal Students Analyzed: {len(results_df)}")
    print(f"\nRisk Distribution:")
    for level, count in risk_counts.items():
        percentage = (count / len(results_df)) * 100
        print(f"  {level}: {count} ({percentage:.1f}%)")
    
    # High-risk students
    high_risk = results_df[results_df['risk_level'].isin(['CRITICAL', 'HIGH'])]
    print(f"\nHigh-Risk Students (CRITICAL + HIGH): {len(high_risk)}")
    print(f"  Percentage: {(len(high_risk) / len(results_df)) * 100:.1f}%")
    
    # Accuracy by actual outcome
    print(f"\nPrediction Accuracy by Actual Outcome:")
    for outcome in df['Target'].unique():
        outcome_df = results_df[results_df['actual_outcome'] == outcome]
        correct = len(outcome_df[outcome_df['predicted_outcome'] == outcome])
        accuracy = (correct / len(outcome_df)) * 100
        print(f"  {outcome}: {accuracy:.1f}% ({correct}/{len(outcome_df)})")
    
    # Average risk scores
    print(f"\nAverage Risk Scores:")
    print(f"  Academic Risk: {results_df['academic_risk'].mean():.2%}")
    print(f"  Socioeconomic Risk: {results_df['socioeconomic_risk'].mean():.2%}")
    print(f"  Dropout Probability: {results_df['dropout_probability'].mean():.2%}")
    
    # Save results
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    output_file = f'reports/risk_analysis_{timestamp}.csv'
    results_df.to_csv(output_file, index=False)
    print(f"\nDetailed results saved to: {output_file}")
    
    # Save summary
    summary = {
        'timestamp': timestamp,
        'total_students': len(results_df),
        'risk_distribution': risk_counts,
        'high_risk_count': len(high_risk),
        'high_risk_percentage': (len(high_risk) / len(results_df)) * 100,
        'average_scores': {
            'academic_risk': float(results_df['academic_risk'].mean()),
            'socioeconomic_risk': float(results_df['socioeconomic_risk'].mean()),
            'dropout_probability': float(results_df['dropout_probability'].mean())
        }
    }
    
    summary_file = f'reports/summary_{timestamp}.json'
    with open(summary_file, 'w') as f:
        json.dump(summary, f, indent=2)
    print(f"Summary saved to: {summary_file}")
    
    # Top 20 highest risk students
    top_risk = results_df.nlargest(20, 'dropout_probability')
    print(f"\nTop 20 Highest Risk Students:")
    print(top_risk[['student_index', 'actual_outcome', 'risk_level', 'dropout_probability']].to_string(index=False))
    
    return results_df

if __name__ == "__main__":
    import os
    os.makedirs('reports', exist_ok=True)
    analyze_all_students()
