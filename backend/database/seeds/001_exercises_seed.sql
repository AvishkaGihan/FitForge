-- Seed exercise data with comprehensive fitness library
INSERT INTO exercises (name, description, muscle_groups, equipment, instructions, difficulty, video_url, thumbnail_url)
VALUES
-- Bodyweight Exercises - Beginner
('Push-Ups', 'Classic upper body exercise', ARRAY['chest', 'triceps', 'shoulders'], ARRAY['bodyweight'], 'Start in plank position. Lower body until chest nearly touches floor. Push back up.', 'Beginner', null, null),
('Bodyweight Squats', 'Fundamental lower body movement', ARRAY['legs', 'glutes'], ARRAY['bodyweight'], 'Stand with feet shoulder-width apart. Lower hips back and down. Return to standing.', 'Beginner', null, null),
('Plank', 'Core stability exercise', ARRAY['core'], ARRAY['bodyweight'], 'Hold push-up position on forearms. Keep body straight. Hold for time.', 'Beginner', null, null),
('Lunges', 'Single-leg lower body exercise', ARRAY['legs', 'glutes'], ARRAY['bodyweight'], 'Step forward with one leg. Lower hips until both knees bent at 90°. Return and repeat.', 'Beginner', null, null),
('Mountain Climbers', 'Dynamic core and cardio exercise', ARRAY['core', 'cardio'], ARRAY['bodyweight'], 'Start in plank. Alternately drive knees toward chest in running motion.', 'Beginner', null, null),

-- Bodyweight Exercises - Intermediate
('Pull-Ups', 'Upper body pulling exercise', ARRAY['back', 'biceps'], ARRAY['pullup_bar'], 'Hang from bar with overhand grip. Pull body up until chin over bar. Lower with control.', 'Intermediate', null, null),
('Diamond Push-Ups', 'Tricep-focused push-up variation', ARRAY['triceps', 'chest'], ARRAY['bodyweight'], 'Push-up position with hands forming diamond shape. Lower and push up.', 'Intermediate', null, null),
('Jump Squats', 'Explosive lower body exercise', ARRAY['legs', 'glutes', 'cardio'], ARRAY['bodyweight'], 'Perform squat, then explosively jump up. Land softly and repeat.', 'Intermediate', null, null),
('Burpees', 'Full body conditioning exercise', ARRAY['full_body', 'cardio'], ARRAY['bodyweight'], 'Drop to plank, do push-up, jump feet to hands, jump up. Repeat continuously.', 'Intermediate', null, null),

-- Dumbbell Exercises - Beginner
('Dumbbell Chest Press', 'Upper body pressing movement', ARRAY['chest', 'triceps', 'shoulders'], ARRAY['dumbbells', 'bench'], 'Lie on bench. Press dumbbells up from chest. Lower with control.', 'Beginner', null, null),
('Dumbbell Rows', 'Back strengthening exercise', ARRAY['back', 'biceps'], ARRAY['dumbbells', 'bench'], 'Bend over bench. Pull dumbbell to hip. Lower and repeat.', 'Beginner', null, null),
('Dumbbell Bicep Curls', 'Arm isolation exercise', ARRAY['biceps'], ARRAY['dumbbells'], 'Stand holding dumbbells. Curl weights to shoulders. Lower with control.', 'Beginner', null, null),
('Dumbbell Shoulder Press', 'Shoulder development exercise', ARRAY['shoulders', 'triceps'], ARRAY['dumbbells'], 'Stand or sit. Press dumbbells overhead. Lower to shoulders.', 'Beginner', null, null),
('Goblet Squats', 'Front-loaded squat variation', ARRAY['legs', 'glutes', 'core'], ARRAY['dumbbells'], 'Hold dumbbell at chest. Squat down. Return to standing.', 'Beginner', null, null),

-- Dumbbell Exercises - Intermediate
('Dumbbell Lunges', 'Weighted single-leg exercise', ARRAY['legs', 'glutes'], ARRAY['dumbbells'], 'Hold dumbbells at sides. Perform walking or stationary lunges.', 'Intermediate', null, null),
('Dumbbell Romanian Deadlift', 'Posterior chain exercise', ARRAY['back', 'glutes', 'legs'], ARRAY['dumbbells'], 'Hold dumbbells. Hinge at hips keeping back straight. Return to standing.', 'Intermediate', null, null),
('Renegade Rows', 'Core and back combination', ARRAY['back', 'core'], ARRAY['dumbbells'], 'Plank position on dumbbells. Row one dumbbell while stabilizing. Alternate.', 'Intermediate', null, null),

-- Dumbbell Exercises - Advanced
('Dumbbell Snatch', 'Explosive full body movement', ARRAY['full_body', 'shoulders'], ARRAY['dumbbells'], 'Explosive pull from ground to overhead in one motion. Control descent.', 'Advanced', null, null),
('Turkish Get-Up', 'Complex functional movement', ARRAY['full_body', 'core', 'shoulders'], ARRAY['dumbbells'], 'Lie down holding dumbbell. Stand up while keeping weight overhead. Reverse.', 'Advanced', null, null),

-- Barbell Exercises - Intermediate
('Barbell Back Squat', 'King of leg exercises', ARRAY['legs', 'glutes', 'back'], ARRAY['barbell'], 'Bar on upper back. Squat down keeping chest up. Drive up through heels.', 'Intermediate', null, null),
('Barbell Bench Press', 'Classic chest builder', ARRAY['chest', 'triceps', 'shoulders'], ARRAY['barbell', 'bench'], 'Lie on bench. Lower bar to chest. Press up to lockout.', 'Intermediate', null, null),
('Barbell Deadlift', 'Fundamental strength exercise', ARRAY['back', 'legs', 'glutes'], ARRAY['barbell'], 'Grip bar on ground. Lift by extending hips and knees. Lower with control.', 'Intermediate', null, null),
('Barbell Rows', 'Back thickness builder', ARRAY['back', 'biceps'], ARRAY['barbell'], 'Bent over position. Pull bar to lower chest/upper abs. Lower with control.', 'Intermediate', null, null),
('Barbell Overhead Press', 'Shoulder strength exercise', ARRAY['shoulders', 'triceps', 'core'], ARRAY['barbell'], 'Stand holding bar at shoulders. Press overhead to lockout. Lower to shoulders.', 'Intermediate', null, null),

-- Barbell Exercises - Advanced
('Barbell Front Squat', 'Quad-dominant squat variation', ARRAY['legs', 'glutes', 'core'], ARRAY['barbell'], 'Bar in front rack position. Squat down keeping elbows high. Drive up.', 'Advanced', null, null),
('Barbell Clean', 'Olympic lift variation', ARRAY['full_body', 'legs', 'back'], ARRAY['barbell'], 'Explosive pull from ground to front rack position. Catch in quarter squat.', 'Advanced', null, null),

-- Resistance Band Exercises - Beginner
('Band Pull-Aparts', 'Shoulder health exercise', ARRAY['shoulders', 'back'], ARRAY['bands'], 'Hold band at chest height. Pull apart stretching band. Return with control.', 'Beginner', null, null),
('Band Squats', 'Banded lower body exercise', ARRAY['legs', 'glutes'], ARRAY['bands'], 'Stand on band holding ends. Squat down against resistance. Return to standing.', 'Beginner', null, null),
('Band Chest Press', 'Banded pressing movement', ARRAY['chest', 'triceps'], ARRAY['bands'], 'Anchor band behind. Press forward against resistance. Control return.', 'Beginner', null, null),

-- Cardio Exercises
('Jumping Jacks', 'Classic cardio warm-up', ARRAY['cardio', 'full_body'], ARRAY['bodyweight'], 'Jump while spreading arms and legs. Return to start. Continue rhythmically.', 'Beginner', null, null),
('High Knees', 'Running in place drill', ARRAY['cardio', 'legs'], ARRAY['bodyweight'], 'Run in place driving knees high. Maintain quick tempo.', 'Beginner', null, null),
('Running', 'Cardiovascular endurance', ARRAY['cardio', 'legs'], ARRAY['bodyweight'], 'Run at steady pace for prescribed duration or distance.', 'Beginner', null, null),

-- Core Exercises
('Bicycle Crunches', 'Dynamic ab exercise', ARRAY['core'], ARRAY['bodyweight'], 'Lie on back. Alternately bring opposite elbow to knee in cycling motion.', 'Beginner', null, null),
('Russian Twists', 'Oblique strengthening', ARRAY['core'], ARRAY['bodyweight'], 'Sit with feet elevated. Rotate torso side to side touching ground.', 'Beginner', null, null),
('Leg Raises', 'Lower ab exercise', ARRAY['core'], ARRAY['bodyweight'], 'Lie on back. Raise straight legs to vertical. Lower with control.', 'Intermediate', null, null),
('Side Plank', 'Oblique stability exercise', ARRAY['core'], ARRAY['bodyweight'], 'Support body on forearm and side of foot. Hold straight line. Alternate sides.', 'Beginner', null, null),
('Dead Bug', 'Core coordination exercise', ARRAY['core'], ARRAY['bodyweight'], 'Lie on back. Alternately extend opposite arm and leg while maintaining contact with floor.', 'Beginner', null, null),

-- Stretching and Mobility
('Cat-Cow Stretch', 'Spinal mobility exercise', ARRAY['back', 'core'], ARRAY['bodyweight'], 'On hands and knees. Alternate arching and rounding spine slowly.', 'Beginner', null, null),
('Downward Dog', 'Full body stretch', ARRAY['back', 'legs'], ARRAY['bodyweight'], 'From plank, push hips up forming inverted V. Press heels toward ground.', 'Beginner', null, null),
('Childs Pose', 'Resting stretch position', ARRAY['back'], ARRAY['bodyweight'], 'Kneel and sit back on heels. Extend arms forward lowering chest to ground.', 'Beginner', null, null),
('Hip Flexor Stretch', 'Lower body flexibility', ARRAY['legs'], ARRAY['bodyweight'], 'Lunge position. Push hips forward feeling stretch in front hip.', 'Beginner', null, null),

-- Advanced Bodyweight
('Handstand Push-Ups', 'Inverted shoulder press', ARRAY['shoulders', 'triceps', 'core'], ARRAY['bodyweight'], 'Against wall in handstand. Lower head to ground. Press back up.', 'Advanced', null, null),
('Pistol Squats', 'Single leg squat', ARRAY['legs', 'glutes'], ARRAY['bodyweight'], 'Stand on one leg. Squat down on single leg. Return to standing.', 'Advanced', null, null),
('L-Sit', 'Core and arm strength hold', ARRAY['core', 'shoulders'], ARRAY['bodyweight'], 'Support body on hands with legs extended parallel to ground. Hold.', 'Advanced', null, null),

-- Gym-Specific Exercises
('Lat Pulldown', 'Back width exercise', ARRAY['back', 'biceps'], ARRAY['gym'], 'Grip bar overhead. Pull down to chest. Control return to start.', 'Beginner', null, null),
('Cable Flyes', 'Chest isolation exercise', ARRAY['chest'], ARRAY['gym'], 'Stand between cable towers. Bring handles together in front. Control return.', 'Intermediate', null, null),
('Leg Press', 'Machine leg exercise', ARRAY['legs', 'glutes'], ARRAY['gym'], 'Seated on machine. Press platform away. Lower with control.', 'Beginner', null, null),
('Leg Curl', 'Hamstring isolation', ARRAY['legs'], ARRAY['gym'], 'Lie prone on machine. Curl legs up. Lower with control.', 'Beginner', null, null),
('Seated Row', 'Mid-back exercise', ARRAY['back'], ARRAY['gym'], 'Seated at cable. Pull handle to torso. Control return.', 'Beginner', null, null)

ON CONFLICT (name) DO NOTHING;